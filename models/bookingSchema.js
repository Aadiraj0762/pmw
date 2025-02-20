// const mongoose = require("mongoose");
// const Vendor = require("./venderSchema");
// const bookingSchema = new mongoose.Schema(
//   {
//     userid: {
//       type: String,
//     },
//     vendorId: {
//       type: String,
//     },
//     amount: {
//       type: String,
//     },
//     hour: {
//       type: String,
//     },
//     vehicleType: {
//       type: String,
//     },
//     personName: {
//       type: String
//     },
//     mobileNumber: {
//       type: String
//     },
//     carType: {
//       type: String,
//     },
//     vehicleNumber: {
//       type: String,
//     },
//     bookingDate: {
//       type: String,
//     },
//     subsctiptiontype: {
//       type: String,
//     },
//     bookingTime: {
//       type: String,
//     },
//     status: {
//       type: String,
//     },
//     tenditivecheckout: {
//       type: String,
//     },
//     sts: {
//       type: String,
//     },
//     cancelledStatus: {
//       type: String,
//       default: "",
//     },
//   },
// );
const mongoose = require("mongoose");
const Vendor = require("./venderSchema");

const bookingSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
    },
    vendorId: {
      type: String,
    },
    amount: {
      type: String,
    },
    hour: {
      type: String,
    },
    vehicleType: {
      type: String,
    },
    personName: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    carType: {
      type: String,
    },
    vehicleNumber: {
      type: String,
    },
    bookingDate: {
      type: String,
    },
    subsctiptiontype: {
      type: String,
    },
    bookingTime: {
      type: String,
    },
    status: {
      type: String,
    },
    tenditivecheckout: {
      type: String,
    },
    sts: {
      type: String,
    },
    cancelledStatus: {
      type: String,
      default: "",
    },

    // ✅ Newly added fields
    approvedDate: { type: String, default: null }, // Stores the date when approved (YYYY-MM-DD)
    approvedTime: { type: String, default: null }, // Stores the time when approved (HH:MM:SS)
    cancelledDate: { type: String, default: null }, // Stores the date when cancelled
    cancelledTime: { type: String, default: null }, // Stores the time when cancelled
    parkedDate: { type: String, default: null }, // Stores the date when parked
    parkedTime: { type: String, default: null }, // Stores the time when parked
    exitDate: { type: String, default: null }, // Stores exit date (YYYY-MM-DD)
    exitTime: { type: String, default: null }, // Stores exit time (HH:MM:SS)

  },
  { timestamps: true } // ✅ This ensures "createdAt" & "updatedAt" fields are auto-managed by MongoDB
);

module.exports = mongoose.model("Booking", bookingSchema);

// bookingSchema.pre("save", async function (next) {
//   try {
//     const booking = this;
//     // Fetch the vendor details
//     const vendor = await Vendor.findById(booking.vendorId);
//     if (!vendor) {
//       throw new Error("Vendor not found");
//     }
//     // Fetch the parking limit for the specific vehicle type (car/bike)
//     const parkingLimit = vendor.parkingEntries.find(
//       (entry) => entry.type.toLowerCase() === booking.vehicleType.toLowerCase()
//     );
//     if (!parkingLimit) {
//       throw new Error(`No parking limit defined for vehicle type: ${booking.vehicleType}`);
//     }
//     // Parse the parking limit
//     const limit = parseInt(parkingLimit.count, 10);
//     // Count the current active bookings for the vendor and the specific vehicle type
//     const currentBookings = await mongoose.model("Booking").countDocuments({
//       vendorId: booking.vendorId,
//       vehicleType: booking.vehicleType, // Filter by the specific vehicle type (car or bike)
//       status: { $ne: "cancelled" }, // Exclude cancelled bookings
//     });
//     // Determine the booking status for the specific vehicle type
//     booking.status = currentBookings + 1 > limit ? "pending" : "booked";
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
