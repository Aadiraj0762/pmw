const Booking = require("../../../models/bookingSchema");
const vendorModel = require("../../../models/venderSchema");
exports.createBooking = async (req, res) => {
  try {
    const {
      userid,
      vendorId,
      amount,
      hour,
      personName,
      mobileNumber,
      vehicleType,
      carType,
      vehicleNumber,
      bookingDate,
      bookingTime,
      tenditivecheckout,
      subsctiptiontype,
      status,
      sts,
    } = req.body;
    const newBooking = new Booking({
      userid,
      vendorId,
      amount,
      hour,
      personName,
      vehicleType,
      mobileNumber,
      carType,
      vehicleNumber,
      bookingDate,
      bookingTime,
      tenditivecheckout,
      subsctiptiontype,
      status,
      sts,
    });
    await newBooking.save();
    res.status(200).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getBookingsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const bookings = await Booking.find({ status });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.updateApproveBooking = async (req, res) => {
  try {
    console.log("BOOKING ID", req.params);
    const { id } = req.params; 
    const booking = await Booking.findById({ _id: id });

    if (!booking) {
      return res.status(400).json({ success: false, message: "Booking not found" });
    }
    if (booking.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Only pending bookings can be approved" });
    }

    // ✅ Set Status & Approval Time
    const now = new Date();
    booking.status = "Approved";
    booking.approvedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    booking.approvedTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

    await booking.save();
    res.status(200).json({
      success: true,
      message: "Booking approved successfully",
      data: booking,
    });
  } catch (error) {
    console.log("err", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCancelBooking = async (req, res) => {
  try {
    console.log("BOOKING ID", req.params);
    const { id } = req.params; 
    const booking = await Booking.findById({ _id: id });

    if (!booking) {
      return res.status(400).json({ success: false, message: "Booking not found" });
    }
    if (booking.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Only pending bookings can be Cancelled" });
    }

    // ✅ Set Status & Cancellation Time
    const now = new Date();
    booking.status = "Cancelled";
    booking.cancelledDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    booking.cancelledTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

    await booking.save();
    res.status(200).json({
      success: true,
      message: "Booking Cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.log("err", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.allowParking = async (req, res) => {
  try {
    console.log("BOOKING ID", req.params);
    const { id } = req.params;
    const booking = await Booking.findById({ _id: id });

    if (!booking) {
      return res.status(400).json({ success: false, message: "Booking not found" });
    }
    if (booking.status !== "Approved") {
      return res.status(400).json({ success: false, message: "Only Approved bookings are allowed" });
    }

    // ✅ Set Status & Parking Time
    const now = new Date();
    booking.status = "Parked";
    booking.parkedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    booking.parkedTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

    await booking.save();
    res.status(200).json({
      success: true,
      message: "Vehicle Parked Successfully",
      data: booking,
    });
  } catch (error) {
    console.log("err", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingsByVendorId = async (req, res) => {
  try {
    const { id } = req.params; 
    const bookings = await Booking.find({ vendorId: id });

    if (!bookings || bookings.length === 0) {
      return res.status(400).json({ error: "No bookings found for this vendor" });
    }

    // ✅ Ensure all bookings include date & time fields
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      vendorId: booking.vendorId,
      amount: booking.amount,
      hour: booking.hour,
      vehicleType: booking.vehicleType,
      personName: booking.personName,
      mobileNumber: booking.mobileNumber,
      carType: booking.carType,
      vehicleNumber: booking.vehicleNumber,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      subsctiptiontype: booking.subsctiptiontype,
      status: booking.status,
      sts: booking.sts,
      cancelledStatus: booking.cancelledStatus,
      approvedDate: booking.approvedDate || null, // ✅ Include Approval Date
      approvedTime: booking.approvedTime || null, // ✅ Include Approval Time
      cancelledDate: booking.cancelledDate || null, // ✅ Include Cancellation Date
      cancelledTime: booking.cancelledTime || null, // ✅ Include Cancellation Time
      parkedDate: booking.parkedDate || null, // ✅ Include Parking Date
      parkedTime: booking.parkedTime || null, // ✅ Include Parking Time
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));

    res.status(200).json({ bookings: formattedBookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookingsByuserid = async (req, res) => {
  try {
    const { id } = req.params; 
    const bookings = await Booking.find({ userid: id });
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ message: "No bookings found for this user" });
    }
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id); 
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateBookingStatus = async(req,res)=>{
  try{
    console.log("Welcome to update status")
  }catch(err){
    console.log("err in updare the status",err)
  }
}
exports.updateBooking = async (req, res) => {
  try {
    const { carType, personName, mobileNumber, vehicleNumber, isSubscription, bookingDate, bookingTime } = req.body;
    if (!carType || !personName || !mobileNumber || !vehicleNumber || !bookingDate) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      {
        carType,
        personName,
        mobileNumber,
        vehicleNumber,
        isSubscription,
        bookingDate,
        bookingTime
      },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateBookingAmountAndHour = async (req, res) => {
  try {
    const { amount, hour } = req.body;
    if (amount === undefined || hour === undefined) {
      return res.status(400).json({ error: "Amount and hour are required" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // ✅ Set Amount & Hour
    booking.amount = amount;
    booking.hour = hour;
    
    // ✅ Set Status & Exit Time
    const now = new Date();
    booking.status = "COMPLETED";
    booking.exitDate = now.toISOString().split('T')[0]; // ✅ Store Date (YYYY-MM-DD)
    booking.exitTime = now.toTimeString().split(' ')[0]; // ✅ Store Time (HH:MM:SS)

    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Booking updated successfully",
      booking: {
        amount: updatedBooking.amount,
        hour: updatedBooking.hour,
        status: updatedBooking.status,
        exitDate: updatedBooking.exitDate,
        exitTime: updatedBooking.exitTime
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParkedVehicleCount = async (req, res) => {
  try {
    const { vendorId } = req.params;
    console.log("Received vendorId:", vendorId);
    const trimmedVendorId = vendorId.trim();
    console.log("Trimmed vendorId:", trimmedVendorId);
    const existingData = await Booking.find({ vendorId: trimmedVendorId });
    console.log("Existing data for vendor:", existingData);
    if (existingData.length === 0) {
      return res.status(404).json({ message: "No bookings found for this vendor." });
    }
    const aggregationResult = await Booking.aggregate([
      {
        $match: { 
          vendorId: trimmedVendorId,
          status: "PARKED"
        }
      },
      {
        $group: {
          _id: "$vehicleType",
          count: { $sum: 1 }
        }
      }
    ]);
    console.log("Aggregation Result:", aggregationResult);
    let response = {
      totalCount: 0,
      Cars: 0,
      Bikes: 0,
      Others: 0
    };
    aggregationResult.forEach(({ _id, count }) => {
      response.totalCount += count;
      if (_id === "Car") {
        response.Cars = count;
      } else if (_id === "Bike") {
        response.Bikes = count;
      } else {
        response.Others += count;
      }
    });
    console.log("Final Response:", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching parked vehicle count for vendor ID:", vendorId, error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAvailableSlotCount = async (req, res) => {
  try {
    const { vendorId } = req.params;
    console.log("Received Vendor ID:", vendorId); 
    const trimmedVendorId = vendorId.trim(); 
    console.log("Trimmed Vendor ID:", trimmedVendorId); 
    const vendorData = await vendorModel.findOne({ _id: trimmedVendorId }, { parkingEntries: 1 });
    if (!vendorData) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    const parkingEntries = vendorData.parkingEntries.reduce((acc, entry) => {
      const type = entry.type.trim();
      acc[type] = parseInt(entry.count) || 0;
      return acc;
    }, {});
    const totalAvailableSlots = {
      Cars: parkingEntries["Cars"] || 0,
      Bikes: parkingEntries["Bikes"] || 0,
      Others: parkingEntries["Others"] || 0
    };
    const aggregationResult = await Booking.aggregate([
      {
        $match: { 
          vendorId: trimmedVendorId,
          status: "PARKED"
        }
      },
      {
        $group: {
          _id: "$vehicleType",
          count: { $sum: 1 }
        }
      }
    ]);
    let bookedSlots = {
      Cars: 0,
      Bikes: 0,
      Others: 0
    };
    aggregationResult.forEach(({ _id, count }) => {
      if (_id === "Car") {
        bookedSlots.Cars = count;
      } else if (_id === "Bike") {
        bookedSlots.Bikes = count;
      } else {
        bookedSlots.Others = count;
      }
    });
    const availableSlots = {
      Cars: totalAvailableSlots.Cars - bookedSlots.Cars,
      Bikes: totalAvailableSlots.Bikes - bookedSlots.Bikes,
      Others: totalAvailableSlots.Others - bookedSlots.Others
    };
    availableSlots.Cars = Math.max(availableSlots.Cars, 0);
    availableSlots.Bikes = Math.max(availableSlots.Bikes, 0);
    availableSlots.Others = Math.max(availableSlots.Others, 0);
    return res.status(200).json({
      totalCount: availableSlots.Cars + availableSlots.Bikes + availableSlots.Others,
      Cars: availableSlots.Cars,
      Bikes: availableSlots.Bikes,
      Others: availableSlots.Others
    });
  } catch (error) {
    console.error("Error fetching available slot count for vendor ID:", req.params.vendorId, error);
    res.status(500).json({ error: error.message });
  }
};
exports.getBookingTimeline = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // ✅ Extract all timeline-related fields
    const timeline = {
      bookingDate: booking.bookingDate || null,
      bookingTime: booking.bookingTime || null,
      approvedDate: booking.approvedDate || null,
      approvedTime: booking.approvedTime || null,
      cancelledDate: booking.cancelledDate || null,
      cancelledTime: booking.cancelledTime || null,
      parkedDate: booking.parkedDate || null,
      parkedTime: booking.parkedTime || null,
      exitDate: booking.exitDate || null,
      exitTime: booking.exitTime || null
    };

    // ✅ If exitDate & exitTime exist, remove cancel details
    if (booking.exitDate && booking.exitTime) {
      delete timeline.cancelledDate;
      delete timeline.cancelledTime;
    }

    res.status(200).json({ timeline });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const bookParkingSlot = async (req, res) => {
//   try {
//     console.log("Welcome to the booking vehicle");
//     const { id } = req.query;
//     const { place, vehicleNumber, bookingDate, time, vendorId } = req.body;
//     if (!id || !place || !vehicleNumber || !bookingDate || !time) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     const [day, month, year] = bookingDate.split("-");
//     const formattedDate = new Date(`${year}-${month}-${day}`);
//     if (isNaN(formattedDate.getTime())) {
//       return res.status(400).json({ message: "Invalid date format for bookingDate" });
//     }
//     const newBooking = new ParkingBooking({
//       place,
//       vehicleNumber,
//       time,
//       bookingDate: formattedDate, 
//       userId: id,
//       vendorId,
//     });
//     await newBooking.save();
//     res.status(201).json({
//       message: "Parking slot booked successfully",
//       booking: newBooking,
//     });
//   } catch (err) {
//     console.error("Error in booking the slot:", err);
//     res.status(500).json({ message: "Error in booking the slot" });
//   }
// };