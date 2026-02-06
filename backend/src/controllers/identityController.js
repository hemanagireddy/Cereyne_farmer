const User = require('../models/User');
const { sendToken } = require('../services/authService');
const AppError = require('../utils/appError');

exports.register = async (req, res, next) => {
    try {
        const { fullName, email, password, farmName } = req.body;

        const newUser = await User.create({
            fullName,
            email,
            password,
            farmName
        });

        sendToken(newUser, 201, res);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return next(new AppError('Please provide email and password!', 400));
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.isCorrectPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3) If everything ok, send token
        sendToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};
