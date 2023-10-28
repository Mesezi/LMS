import { useRef, useEffect, useState } from "react";
import { auth, database } from "../../../fireBaseConfig";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { detailsReducer } from "../../store/slice/currentUser";
import { getDocs, getDoc, doc, collection } from "firebase/firestore";
import bcrypt from "bcryptjs";
import getSchoolandAccountType from '../../utils/getSchoolandAccountType'

const Login = () => {
  const authDetails = useSelector((state) => state.user.authDetails);
  const navigate = useNavigate();
  const [schoolClassList, setSchoolClassList] = useState(null);
  const [classDetails, setClassDetails] = useState({});
  const [loginDisplay, setLoginDisplay] = useState("");

  const email = useRef();
  const password = useRef();

  useEffect(() => {
    // if class exists in session storage navigate to dashboard
    if (sessionStorage.getItem("class")){
      navigate("/class");
    } 
    else if (authDetails) {
      const accountDetails = getSchoolandAccountType(authDetails.displayName)

      if (accountDetails.type !== "class") return navigate("/");

        const classes = [];
        getDocs(collection(database, `SCHOOLS/${accountDetails.school}/CLASSES`)).then(
          (res) => {
            res.forEach((doc) => classes.push(doc.id));
            setSchoolClassList(classes);
          }
        );
    

      
    }
  }, [authDetails]);


  const loginUser = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(
      auth,
      email.current.value,
      password.current.value
    )
      .then((res) => {
        const accountDetails = getSchoolandAccountType(res.user.displayName)
        const classes = [];

        if (accountDetails.type === "class") {
          // using school name retrieve school classes from firestore
          getDocs(collection(database, `SCHOOLS/${accountDetails.school}/CLASSES`)).then(
            (res) => {
              res.forEach((doc) => classes.push(doc.id));
              setSchoolClassList(classes);
            }
          );
        } else {
          signOut(res.user.auth).then(() => alert("wrong details"));
        } // sign out user because their account is not a class account
      })
      .catch((err) => console.log(err.message));

    //   e.preventDefault()

    //     try{
    //         const user =  await createUserWithEmailAndPassword(auth, email.current.value, password.current.value)

    //         await updateProfile(user.user, {
    //             displayName: "admin"
    //           })
    //     }
    //     catch(err){
    //         alert(err.message)
    //     }
  };

  const handleClassInput = (e) => {
    setClassDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const loginClass = async (e) => {
    console.log(e.target)
    e.preventDefault();
    const accountDetails = getSchoolandAccountType(authDetails?.displayName)

    const docRef = doc(
      database,
      `SCHOOLS/${accountDetails.school}/CLASSES/${classDetails.className}`
    );
    const docSnap = await getDoc(docRef);
    const classInfo = docSnap.data();

    //compare hashed password in firestore to entered password
    const keyComparison = bcrypt.compareSync(classDetails.key, classInfo.key);

    if (keyComparison) {
      detailsReducer({
        className: classInfo.name,
        ...accountDetails
      }); // save user details to redux store
      sessionStorage.setItem("class", docSnap.id); // save user class in session storage in case of refresh
      navigate("/class");
    } else {
      alert("key is wrong for selected class");
    }
  };

  if (!schoolClassList)
    return (
      <form
        onSubmit={(e) => loginUser(e)}
        className="flex p-8 rounded-md bg-green-200 flex-col gap-5 w-60"
      >
        <label htmlFor="Eamil">Email</label>
        <input type="mail" ref={email} />
        <br />
        <label htmlFor="">Password</label>
        <input type="password" ref={password} />
        <button>Submit</button>
      </form>
    );

  if (schoolClassList)
    return (
      <form onSubmit={(e) => loginClass(e)}>
        <div>
          <label htmlFor="">Choose class</label>
          <select
            name="className"
            onChange={(e) => handleClassInput(e)}
            id=""
            required
          >
            <option value=""></option>
            {schoolClassList?.map((el) => (
              <option value={el}>{el}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="key">Class Key</label>
          <input
            type="text"
            name="key"
            required
            onChange={(e) => handleClassInput(e)}
            autoComplete="off"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    );
};

export default Login;
