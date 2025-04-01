const Doctor = require("../Model/DoctorModel");

//data display
const getAllDoctors = async (req, res, next) => {

    let Doctors;
      //get all doctors
     try{
      doctors = await Doctor.find();
     }catch (err) {
        console.log(err);
     }
     //not found
     if(!doctors){
        return res.status(404).json({message:"Doctor not found"});
     }
     // display all doctors
     return res.status(200).json({ doctors });

};

//data Insert
const addDoctors = async (req, res, next) => {
   const {doctorId, name, specializedField, assignedPatients, availableSlot} = req.body;

   let doctors;

   try{
      doctors = new Doctor({doctorId, name, specializedField, assignedPatients, availableSlot});
      await doctors.save();
   }catch (err) {
      console.log(err);
   }

   //not insert doctors
   if(!doctors){
      return res.status(404).json({message:"Unable to add doctors"});
   }
   return res.status(200).json({doctors});
};

//get by Id
const getById = async (req, res, next) => {
   const id = req.params.id;
   let doctor;
   try{
      doctor = await Doctor.findById(id);
   }catch (err) {
      console.log(err);
   }
   //not available doctors
   if(!doctor){
      return res.status(404).json({message:"Doctor not found"});
   }
   return res.status(200).json({ doctor });
};

//Update Doctor Details
const updateDoctor = async (req, res, next) => {
   
   const id = req.params.id;
   const {doctorId, name, specializedField, assignedPatients, availableSlot} = req.body;

   let doctors

   try{
      doctors = await Doctor.findByIdAndUpdate(id, 
         {doctorId: doctorId, name: name, specializedField:specializedField , assignedPatients: assignedPatients, availableSlot: availableSlot});
         doctors = await doctors.save();
   }catch (err) {
      console.log(err);
   }
   //not update doctors
   if(!doctors){
      return res.status(404).json({message:"Unable to Update Doctor Details"});
   }
   return res.status(200).json({ doctors });
};

//Delete Doctor
const deleteDoctor = async (req, res, next) => {
   const id = req.params.id;
   let doctor;
   try{
      doctor = await Doctor.findByIdAndDelete(id);
   }catch (err) {
      console.log(err);
   }
   //not delete doctors
   if(!doctor){
      return res.status(404).json({message:"Unable to Delete Doctor Details"});
   }
   return res.status(200).json({ doctor });
};


exports.getAllDoctors = getAllDoctors;
exports.addDoctors = addDoctors;
exports.getById = getById;
exports.updateDoctor = updateDoctor;
exports.deleteDoctor = deleteDoctor;
