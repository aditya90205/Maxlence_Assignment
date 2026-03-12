const User = require('../models/User');
const { Op } = require('sequelize');
const redisClient = require('../config/redis').client;

const getCachedData = async (key) => {
    try {
        if(redisClient.isReady) {
           const data = await redisClient.get(key);
           if (data) return JSON.parse(data);
        }
    } catch(e) { console.error('Redis GET Error', e); }
    return null;
}

const setCachedData = async (key, data) => {
   try {
       if (redisClient.isReady) {
           await redisClient.setEx(key, 60, JSON.stringify(data));
       }
   } catch (e) { console.error('Redis SET Error', e); }
}


exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const cacheKey = `users:page:${page}:limit:${limit}:search:${search}`;
    const cachedUsers = await getCachedData(cacheKey);
    if (cachedUsers) {
      console.log('Serving from Redis cache');
      return res.json(cachedUsers);
    }

    const whereClause = search ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      attributes: ['id', 'name', 'email', 'role', 'profile_image', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    const response = {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users: rows
    };

    await setCachedData(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'verification_token', 'reset_password_token'] }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ where: { email: req.body.email } });
      if (emailExists) return res.status(400).json({ message: 'Email is already in use' });
      user.email = req.body.email;
    }

    if (req.file) {
      user.profile_image = `/uploads/${req.file.filename}`;
    }

    await user.save();
    
    if (redisClient && redisClient.isReady) {
       await redisClient.flushDb();
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_image: user.profile_image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.id === req.user.id) {
        return res.status(400).json({ message: 'Cannot delete your own account here' });
    }

    await user.destroy();
    
    if (redisClient && redisClient.isReady) {
       await redisClient.flushDb();
    }

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
