import React, { useState, useEffect } from 'react';
import { musicTypeCheck, actionTypeCheck, venueTypeCheck, drinkTypeCheck, cuisineTypeCheck } from '../../services/types'
import Pagination from '../Pagination/Pagination'
import useForm from '../../hooks/useVenue';
import ActionType from '../ActionType/ActionType';
import MusicType from '../MusicType/MusicType';

export default function Venue() {

    const [totalPage, settotalPage] = useState(0)
    const [currentPage, setcurrentPage] = useState(0)
    const [data, setdata] = useState([]);
    const [loading, setloading] = useState(false);
    const [searchterm, setsearchterm] = useState("");
    const [User, setUser] = useState("");
    const [id, setid] = useState("")

    const handleSearchChange = (e) => {
        setsearchterm(e.target.value)
    }

    const submit = (success, error, isSubmitting) => {
        let token = "Bearer " + localStorage.getItem('jwt').substring(1, localStorage.getItem('jwt').length - 1);
        try {
            fetch(`https://api.lono.app/api/venue/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(values)
            }).then(res => {
                if (res.status === 200) {
                    success(true);
                    error(false);
                    isSubmitting(false)
                } else {
                    success(false);
                    error(true)
                    isSubmitting(false)
                }
            });
        } catch (error) {
            error(true)
            isSubmitting(false)
        }
    }
    const { handleChange, handleLocation, values, handleSubmit, error, success, isSubmitting, setValues } = useForm(submit);


    const deleteOne = () => {
        let token = "Bearer " + localStorage.getItem('jwt').substring(1, localStorage.getItem('jwt').length - 1);
        setloading(true)
        console.log(`https://api.lono.app/api/venue/delete/${id}`)
        fetch(`https://api.lono.app/api/venue/delete/${id}`, {
            method: "delete",
            headers: {
                "Authorization": token
            }
        }).then(res => {
            if (res.status === 200) {
                let newData = data.filter(data => data.venueId !== id)
                setdata(newData);
                setloading(false);
            }
        })
    }

    const edit = (data) => {
        setValues(data);
        console.log(data);
    }
    // handleSearch data
    const handleSearch = (e) => {
        e.preventDefault();
        let url = `https://api.lono.app/api/data/search/${searchterm}/1`
        console.log(url)
        fetch(url).then(res => res.json().then(result => setdata(result.$values)))
    }

    // Load data when Venue Event is Called
    useEffect(() => {
        setloading(true)
        fetch(`https://api.lono.app/api/venue/all/Montreal/${currentPage}`).then(res => res.json()).then(result => { console.log(result); settotalPage(result.length); setloading(false); setdata(result.data.$values) })
        if (localStorage.getItem('jwt') && localStorage.getItem('cached_token')) {
            let token = "Bearer " + localStorage.getItem('jwt').substring(1, localStorage.getItem('jwt').length - 1);
            let id = localStorage.getItem('cached_token').substring(1, localStorage.getItem('cached_token').length - 1);
            fetch(`https://api.lono.app/api/account/data/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            }).then(res => { res.json().then(result => setUser(result)); })
        }
    }, [currentPage]);

    const paginate = number => { setcurrentPage(number) }

    return (
        <div>
            <div className="input-group mb-3">
                <input type="text" className="form-control" onChange={handleSearchChange} placeholder="Enter Venue Name" aria-label="Recipient's username" aria-describedby="basic-addon2" value={searchterm} />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" onClick={handleSearch} type="button">Search</button>
                </div>
            </div>
            {loading ? (
                <div className="d-flex justify-content-center ">
                    <div className="spinner-border" style={{ width: "10rem", height: "10rem" }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>) : (
                    <React.Fragment>
                        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLongTitle">Edit Venue</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                        <div className="modal-body">
                                            <form className="form" role="form" autoComplete="off" onSubmit={handleSubmit}>
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label form-control-label" htmlFor="name">Name</label>
                                                    <div className="col-lg-9">
                                                        <input className="form-control" id="name" name="name" type="text" onChange={handleChange} value={values.name} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label form-control-label" htmlFor="description">Description</label>
                                                    <div className="col-lg-9">
                                                        <textarea className="form-control" id="description" type="text" name="description" onChange={handleChange} value={values.description} />
                                                    </div>
                                                </div>
                                                {/* <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label form-control-label" htmlFor="photoUrl">Photo URL</label>
                                                    <div className="col-lg-9" htmlFor="photoUrl">
                                                        <input className="form-control" id="photoUrl" name="photoUrl" type="text" onChange={handleChange} value={values.profileUrl} />
                                                    </div>
                                                </div> */}
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label form-control-label">HyperLink</label>
                                                    <div className="col-lg-9" htmlFor="hyperLink">
                                                        <input className="form-control" id="hyperLink" name="hyperLink" type="text" onChange={handleChange} value={values.hyperLink} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label form-control-label">Action Type</label>
                                                    <div className="col-lg-9" htmlFor="actionType">
                                                        <ActionType handleChange={handleChange} value={values.actionType} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label form-control-label">Music Type</label>
                                                    <div className="col-lg-9" htmlFor="musicType">
                                                        <MusicType handleChange={handleChange} value={values.musicType} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label form-control-label">City</label>
                                                    <div className="col-lg-9" htmlFor="city">
                                                        <input className="form-control" id="city" onChange={handleChange} name="city" type="text" value={values.city} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label form-control-label">Latitude</label>
                                                    <div className="col-lg-9" htmlFor="lat">
                                                        <input className="form-control" id="lat" name="lat" type="text" value={values.lat} readOnly />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label form-control-label">Longitude</label>
                                                    <div className="col-lg-9" htmlFor="lng">
                                                        <input className="form-control" id="lng" name="lng" type="text" onChange={handleChange} value={values.lng} readOnly />
                                                    </div>
                                                </div>
                                                {success && (<div className="alert alert-success" role="alert"> Success</div>)}
                                                {error && (<div className="alert alert-danger" role="alert"> Contact Vrushabh there is an error!</div>)}
                                                {/* <div className="form-group row">
                                                <label className="col-lg-3 col-form-label form-control-label"></label>
                                                <div className="col-lg-9">
                                                    <input type="reset" className="btn btn-secondary col-lg-6" value="Cancel" />
                                                    <input type="reset" className="btn btn-primary col-lg-6" data-toggle="modal" data-target="#exampleModalCenter" value="Save Changes" />
                                                </div>
                                            </div> */}
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-success" onClick={handleSubmit}>Edit Venue</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLongTitle">Delete Venue</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        Hey {User.name}. You are about to delete a venue with id:{id}. Are you sure?
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-danger" onClick={deleteOne}>Delete Venue</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    {User.userType !== 0 && (<React.Fragment>
                                        <th scope="col">Delete</th>
                                        <th scope="col">Edit</th>
                                    </React.Fragment>)}
                                    <th scope="col">Venue Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col"> Hyperlink</th>
                                    <th scope="col">Photo Url</th>
                                    <th scope="col">Lat</th>
                                    <th scope="col">Lng</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">City</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Venue Type</th>
                                    <th scope="col">Action Type</th>
                                    <th scope="col">Music Type</th>
                                    <th scope="col">Cuisine Type</th>
                                    <th scope="col">Drink Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(data => (
                                    <tr key={data.venueId}>
                                        {User.userType !== 0 && (<React.Fragment>
                                            <td><button type="button" className="btn btn-danger" onClick={()=>{setid(data.venueId)}} data-toggle="modal" data-target="#exampleModalCenter">Delete</button></td>
                                            <td><input type="reset" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" onClick={() => edit(data)} value="Edit"/></td>
                                        </React.Fragment>)}
                                        <td>{data.venueId || "null"}</td>
                                        <td>{data.name || "null"}</td>
                                        <td >{data.description || "null"}</td>
                                        <td>{(data.hyperLink != null) ? (<a href={data.hyperLink}>Link</a>) : "null"}</td>
                                        <td>{(data.profileUrl != null) ? (<a href={data.profileUrl}>View</a>) : "null"}</td>
                                        <td>{data.lat || "null"}</td>
                                        <td>{data.lng || "null"}</td>
                                        <td>{(data.address != null) ? data.address : "null"}</td>
                                        <td>{(data.city != null) ? data.city : "null"}</td>
                                        <td>{(data.phoneNumber != null) ? data.phoneNumber : "null"}</td>
                                        <td>{(data.venueType != null) ? venueTypeCheck(data.venueType) : "No venues!"}</td>
                                        <td>{(data.actionType != null) ? actionTypeCheck(data.actionType) : "No actions!"}</td>
                                        <td>{(data.musicType != null) ? musicTypeCheck(data.musicType) : "No music!"}</td>
                                        <td>{(data.cuisineType != null) ? cuisineTypeCheck(data.cuisineType) : "No cuisine!"}</td>
                                        <td>{(data.drinkType != null) ? drinkTypeCheck(data.drinkType) : "No drinks!"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </React.Fragment>)}
            <Pagination postPerPage={30} totalPosts={totalPage} paginate={paginate} currentPage={currentPage} />
        </div>
    )
}
