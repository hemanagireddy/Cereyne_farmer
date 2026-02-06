const Crop = require('../models/Crop');
const AppError = require('../utils/appError');

exports.getAllCrops = async (req, res, next) => {
    try {
        const crops = await Crop.find({ farmer: req.user._id }).sort('-createdAt');

        // Aggregation for dashboard summary
        const summary = await Crop.aggregate([
            { $match: { farmer: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalCrops: { $sum: 1 },
                    totalQuantity: {
                        $sum: {
                            $multiply: [
                                '$quantity',
                                {
                                    $switch: {
                                        branches: [
                                            { case: { $eq: ['$unit', 'quintals'] }, then: 100 },
                                            { case: { $eq: ['$unit', 'tons'] }, then: 1000 },
                                            { case: { $eq: ['$unit', 'kg'] }, then: 1 }
                                        ],
                                        default: 1
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            results: crops.length,
            summary: summary[0] || { totalCrops: 0, totalQuantity: 0 },
            data: { crops }
        });
    } catch (err) {
        next(err);
    }
};

exports.createCrop = async (req, res, next) => {
    try {
        // Add farmer ID from protected route
        req.body.farmer = req.user._id;

        const newCrop = await Crop.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { crop: newCrop }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateCrop = async (req, res, next) => {
    try {
        const crop = await Crop.findOneAndUpdate(
            { _id: req.params.id, farmer: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!crop) {
            return next(new AppError('No crop found with that ID or you do not have permission', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { crop }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteCrop = async (req, res, next) => {
    try {
        const crop = await Crop.findOneAndDelete({ _id: req.params.id, farmer: req.user._id });

        if (!crop) {
            return next(new AppError('No crop found with that ID or you do not have permission', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};
