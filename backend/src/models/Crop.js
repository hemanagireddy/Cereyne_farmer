const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    yieldName: {
        type: String,
        required: [true, 'Crop name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Grains', 'Vegetables', 'Fruits', 'Legumes', 'Others'],
        default: 'Others'
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        enum: ['kg', 'tons', 'quintals', 'units'],
        default: 'kg'
    },
    plantedDate: {
        type: Date,
        required: [true, 'Planted date is required']
    },
    harvestDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['growing', 'harvested', 'sold'],
        default: 'growing'
    },
    farmer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Crop must belong to a farmer']
    }
}, {
    timestamps: true
});

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;
