import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from "uuid";


const Manager = () => {

    const ref = useRef()
    const passwordRef = useRef()

    const [form, setform] = useState({
        site: "",
        username: "",
        password: ""
    });

    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/");
        let passwords = await req.json();
        console.log(passwords)
        setPasswordArray(passwords);
    }

    useEffect(() => {
        getPasswords()

    }, [])

    const showPassword = () => {

        if (passwordRef.current.type === "password") {

            passwordRef.current.type = "text"
            ref.current.src = "/icons/eye.png"

        } else {

            passwordRef.current.type = "password"
            ref.current.src = "/icons/eyecross.png"

        }
    }

    const savePassword = async () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
        
        // If form.id exists, it's an edit. If not, generate a new one.
        const idToSave = form.id ? form.id : uuidv4();

        // ONLY delete if we are editing an existing entry (form.id is truthy)
        if (form.id) {
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })
        }

        // Add the new/edited password to the frontend state
        setPasswordArray([...passwordArray.filter(item => item.id !== form.id), { ...form, id: idToSave }]);

        // Save to backend using the correct ID
        await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: idToSave }) })

        // Clear the form
        setform({
            site: "",
            username: "",
            password: "",
            id: ""
        });

        toast("Password saved!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    } else {
        toast("Error: Password not saved! Minimum 3 characters required.");
    }
};


    const deletePassword = async (id) => {
        console.log('Deleting password with id: ', id)

        let c = confirm('Do you really mean to delete this password?')
        if (c) {

            setPasswordArray(passwordArray.filter(item => item.id !== id))
            // Change this line:
// await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id }) })

// To this:
await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

            // localStorage.setItem(
            //     "passwords",
            //     JSON.stringify((passwordArray.filter(item => item.id !== id)))
            // )

            toast("Password Deleted", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

        }


        setform({
            site: "",
            username: "",
            password: "",
            id: ""
        })

    }

    const editPassword = (id) => {

        console.log('Editing password with id: ', id)

        setform({...passwordArray.filter(i => i.id === id)[0], id:id})

        setPasswordArray(passwordArray.filter(item => item.id !== id))
        localStorage.setItem(
            "passwords",
            JSON.stringify((passwordArray.filter(item => item.id !== id)))
        )

    }

    const handleChange = (e) => {

        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // COPY FUNCTION
    const copyText = (text) => {
        navigator.clipboard.writeText(text)
        // alert("Copied! " + text)
        toast("Copied! " + text, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    return (
        <>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"

            />

            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
            </div>
            <div className=" p-2  md:mycontainer pt-3">

                <h1 className='text-4xl text font-bold text-center'>

                    <span className='text-green-500'>   &lt; </span>

                    <span>Pass</span>

                    <span className='text-green-500'>OP /&gt; </span>

                </h1>
                <p className=' text-green-900 text-lg text-center'>Your own Password Manger</p>

                <div className='flex flex-col text-black p-4 gap-8 items-center'>

                    <input value={form.site} onChange={handleChange} className='rounded-full border border-green-500 w-full py-1 p-4' placeholder='Enter website URL' type="text" name="site" id='site' />

                    <div className='flex flex-col md:flex-row w-full justify-between gap-8'>

                        <input value={form.username} onChange={handleChange} type="text" placeholder="Enter Username" className='rounded-full border border-green-500 w-full  py-1 p-4' name='username' id='username' />
                        <div className="relative">

                            <input ref={passwordRef} value={form.password} onChange={handleChange} type="text" placeholder='Enter Password' className='rounded-full border border-green-500 w-full  py-1 p-4' name='password' id='password' />
                            <span className="absolute right-[3px] top-[9px] cursor-pointer" onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="/icons/eye.png" alt="eye" />
                            </span>
                        </div>

                    </div>
                    <button onClick={savePassword} className='flex justify-center gap-2 items-center bg-green-400 rounded-full px-8 py-2 w-fit hover:bg-green-300 border-green-900 border-2' >
                        <lord-icon
                            src="https://cdn.lordicon.com/gzqofmcx.json"
                            trigger="hover"
                        >
                        </lord-icon>
                        Save
                    </button>
                </div>

                <div className='passwords pb-10'>

                    <h2 className='font-bold py-4 text-2xl'>
                        Your Passwords
                    </h2>

                    {passwordArray.length === 0 && (
                        <div>No Password To Show</div>
                    )}

                    {passwordArray.length !== 0 && (

                        <table className="table-auto w-full rounded-md overflow-hidden mb-10">

                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>

                            <tbody className='bg-green-100'>

                                {passwordArray.map((item, index) => {

                                    return (

                                        <tr key={index}>

                                            {/* SITE */}
                                            <td className='py-2 text-center border border-white'>

                                                <div className='flex items-center justify-center gap-2'>

                                                    <a
                                                        href={item.site}
                                                        target='_blank'
                                                        rel="noreferrer"
                                                    >
                                                        {item.site}
                                                    </a>

                                                    <div
                                                        className='size-7 cursor-pointer'
                                                        onClick={() => copyText(item.site)}
                                                    >

                                                        <FontAwesomeIcon
                                                            icon={faCopy}
                                                            style={{
                                                                width: "20px",
                                                                height: "20px"
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </td>

                                            {/* USERNAME */}
                                            <td className='py-2 text-center border border-white'>

                                                <div className='flex items-center justify-center gap-2'>

                                                    <span>{item.username}</span>

                                                    <div
                                                        className='size-7 cursor-pointer'
                                                        onClick={() => copyText(item.username)}
                                                    >

                                                        <FontAwesomeIcon
                                                            icon={faCopy}
                                                            style={{
                                                                width: "20px",
                                                                height: "20px"
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </td>

                                            {/* PASSWORD */}
                                            <td className='py-2 text-center border border-white'>

                                                <div className='flex items-center justify-center gap-2'>

                                                    <span>{"*".repeat(item.password.length)}</span>

                                                    <div
                                                        className='size-7 cursor-pointer'
                                                        onClick={() => copyText(item.password)}
                                                    >

                                                        <FontAwesomeIcon
                                                            icon={faCopy}
                                                            style={{
                                                                width: "20px",
                                                                height: "20px"
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="py-2 text-center border border-white">
                                                <span className="cursor-pointer mx-1" onClick={() => { editPassword(item.id) }}>

                                                    <FontAwesomeIcon icon={faPen} />
                                                </span>

                                                <span className="cursor-pointer mx-1" onClick={() => { deletePassword(item.id) }}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </span>
                                            </td>

                                        </tr>
                                    )
                                })}

                            </tbody>

                        </table>
                    )}

                </div>

            </div>


        </>
    )
}

export default Manager