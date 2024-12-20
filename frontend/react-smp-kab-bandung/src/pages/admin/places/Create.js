//import hook from react
import React, { useState, useEffect } from "react";

//import layout
import LayoutAdmin from "../../../layouts/Admin";

//import BASE URL API
import Api from "../../../api";

//import hook history dari react router dom
import { useHistory } from "react-router-dom";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

//import react Quill
import ReactQuill from 'react-quill';

// quill CSS
import 'react-quill/dist/quill.snow.css';

function PlaceCreate() {

	//title page
    document.title = "Add New Place - Administrator Travel GIS";

    //state form
    const [title, setTitle] = useState("");
    const [categoryID, setCategoryID] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [office_hours, setOfficeHours] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    //state image array / multiple
    const [images, setImages] = useState([]);

    //state categories
    const [categories, setCategories] = useState([]);

    //state validation
    const [validation, setValidation] = useState({});

    //token
    const token = Cookies.get("token");

    //history
    const history = useHistory();

    //function "fetchCategories"
    const fetchCategories = async () => {

        //fetching data from Rest API
        await Api.get('/api/web/categories')
        .then(response => {
        	//set data response to state "catgeories"
        	setCategories(response.data.data);
        });

    }

    //hook
    useEffect(() => {
        //call function "fetchCategories"
        fetchCategories();
    }, []);

    //function "handleFileChange"
    const handleFileChange = (e) => {
        
        //define variable for get value image data
        const imageData = e.target.files;

        Array.from(imageData).forEach(image => {
        	//check validation file
            if(!image.type.match('image.*')) {

                setImages([]);

                //show toast
                toast.error("Format File not Supported!", {
                    duration: 4000,
                    position: "top-right",
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });

                return
            } else {
                setImages([...e.target.files]);
            }
        });
        
    }

    //function "storePlace"
    const storePlace = async (e) => {
        e.preventDefault();

        //define formData
        const formData = new FormData();

        //append data to "formData"
        formData.append('title', title);
        formData.append('category_id', categoryID);
        formData.append('description', description);
        formData.append('phone', phone);
        formData.append('website', website);
        formData.append('office_hours', office_hours);
        formData.append('address', address);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);

        Array.from(images).forEach(image => {
            formData.append("image[]", image);
        });

        //send data to server
        await Api.post('/api/admin/places', formData, {
            
            //header
            headers: {
                //header Bearer + Token
                Authorization: `Bearer ${token}`,
            }
            
        }).then(() => {

            //show toast
            toast.success("Data Saved Successfully!", {
                duration: 4000,
                position: "top-right",
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });

            //redirect dashboard page
            history.push("/admin/places");

        })
        .catch((error) => {
            
            //set state "validation"
            setValidation(error.response.data);
        })

    }

    return (
        <React.Fragment>
            <LayoutAdmin>
                <div className="row mt-4 mb-5">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="fa fa-map-marked-alt"></i> ADD NEW PLACE</span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={storePlace}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Image (<i>select many file</i>)</label>
                                        <input type="file" className="form-control" onChange={handleFileChange} multiple/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Title</label>
                                        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Title Place"/>
                                    </div>
                                    {validation.title && (
                                        <div className="alert alert-danger">
                                            {validation.title[0]}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Category</label>
                                            <select className="form-select" value={categoryID} onChange={(e) => setCategoryID(e.target.value)}>
                                                <option value="">-- Select Category --</option>
                                                {
                                                categories.map((category) => (
                                                    <option value={category.id} key={category.id}>{category.name}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                        {validation.category_id && (
                                            <div className="alert alert-danger">
                                                {validation.category_id[0]}
                                            </div>
                                        )}
                                        </div>
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Office Hours</label>
                                            <input type="text" className="form-control" value={office_hours} onChange={(e) => setOfficeHours(e.target.value)} placeholder="Enter Office Hours"/>
                                        </div>
                                        {validation.office_hours && (
                                            <div className="alert alert-danger">
                                                {validation.office_hours[0]}
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description</label>
                                        <ReactQuill theme="snow" rows="5" value={description} onChange={(content) => setDescription(content)}/>
                                    </div>
                                    {validation.description && (
                                        <div className="alert alert-danger">
                                            {validation.description[0]}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Phone</label>
                                            <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone"/>
                                        </div>
                                        {validation.phone && (
                                            <div className="alert alert-danger">
                                                {validation.phone[0]}
                                            </div>
                                        )}
                                        </div>
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Website</label>
                                            <input type="text" className="form-control" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Enter Website Place"/>
                                        </div>
                                        {validation.website && (
                                            <div className="alert alert-danger">
                                                {validation.title[0]}
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Address</label>
                                        <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address Place"></textarea>
                                    </div>
                                    {validation.address && (
                                        <div className="alert alert-danger">
                                            {validation.address[0]}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Latitude</label>
                                            <input type="text" className="form-control" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude Place"/>
                                        </div>
                                        {validation.latitude && (
                                            <div className="alert alert-danger">
                                                {validation.latitude[0]}
                                            </div>
                                        )}
                                        </div>
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Longitude</label>
                                            <input type="text" className="form-control" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude Place"/>
                                        </div>
                                        {validation.longitude && (
                                            <div className="alert alert-danger">
                                                {validation.longitude[0]}
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                    <div>
                                        <button type="submit" className="btn btn-md btn-success me-2"><i className="fa fa-save"></i> SAVE</button>
                                        <button type="reset" className="btn btn-md btn-warning"><i className="fa fa-redo"></i> RESET</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutAdmin>
        </React.Fragment>
    );
}

export default PlaceCreate;