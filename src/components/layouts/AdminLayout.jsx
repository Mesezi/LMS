import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { detailsReducer } from "../../store/slice/currentUser";
import getCurrentDate from "../../utils/getCurrentDate";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { database } from "../../../fireBaseConfig";
import { infoReducer } from "../../store/slice/schoolInfo";
import sortClasses from "../../utils/sortClasses";
import { studentsDataReducer } from "../../store/slice/allStudentsData";
import { registerReducer } from "../../store/slice/registeredClasses";
import CompleteRegistrationModal from "../../components/modal/CompleteRegistrationModal";
import getSchoolandAccountType from "../../utils/getSchoolandAccountType";

const Layout = () => {
  const userDetails = useSelector((state) => state.user.userDetails);
  const authDetails = useSelector((state) => state.user.authDetails);
  const schoolInfo = useSelector((state) => state.schoolInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [termDaysLeft, setTermDaysLeft] = useState("");

  // if user is not admin navigate to landing page
  if (userDetails) {
    if (userDetails.type !== "admin") {
      navigate("/");
    }
  }

  useEffect(() => {
    // split displayName and get school name and account type, to set userDetails
    if (authDetails) {
      dispatch(
        detailsReducer(getSchoolandAccountType(authDetails.displayName))
      );
    }
  }, [authDetails]);

  useEffect(() => {
    const getData = async () => {
      // get school students from firestore
      const schoolStudents = await getDocs(
        collection(database, `SCHOOLS/${userDetails.school}/STUDENTS`)
      );

      //ALL STUDENTS IN SCHOOL
      const students = [];
      schoolStudents.forEach((doc) => {
        students.push({ ...doc.data(), id: doc.id });
      });

      dispatch(studentsDataReducer(students));

      // get school info from firestore
      const docRef = doc(database, `SCHOOLS/${userDetails.school}`);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          dispatch(infoReducer(docSnap.data()));
        } else {
          alert("No such document!");
        }
      });

      // get all reistered school classes from firestore
      let classes = [];
      getDocs(collection(database, `SCHOOLS/${userDetails.school}/CLASSES`))
        .then((res) =>
          res.forEach((doc) => {
            classes.push(doc.id);
            classes = sortClasses(classes); // function sorts the classes accordingly
          })
        )
        .then(() => dispatch(registerReducer(classes)));
    };

    if (userDetails) {
      {
        onSnapshot(doc(database, "SCHOOLS", userDetails.school), (doc) => {
          // KEEP TRACK OF CHANGES IN FIRESTORE AND CALL FUNCTION IF ANY CHANGE
          getData();
        });
      }
    }
  }, [userDetails]);

  useEffect(() => {
    if (schoolInfo) {
      var today = new Date(getCurrentDate());
      var termEnd = new Date(schoolInfo.session["end date"]);

      // To calculate the time difference of two dates
      var Difference_In_Time = termEnd.getTime() - today.getTime();

      // To calculate the no. of days between two dates
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      setTermDaysLeft(Difference_In_Days);
    }
  }, [schoolInfo]);


  const logOut = () => {
    signOut(authDetails.auth)
      .then(() => navigate("/admin-login"))
      .finally(sessionStorage.clear());
  };
  

  const [isConnected, setIsConnected] = useState(navigator.onLine);

  useEffect(() => {
    const handleConnectionChange = () => {
      setIsConnected(navigator.onLine);
    };

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  return (
    <>
      {userDetails?.type === "admin" && (
        <main className="flex">
          {/* <CompleteRegistrationModal schoolInfo={schoolInfo}/> */}

          <aside className="h-screen fixed translate-x-[-100vw] lg:translate-x-0 w-[18%] bg-blue-500 p-5 flex flex-col gap-4">
            <h3>LMS</h3>
            <ul className="flex flex-col gap-2">
              <li className="p-3 rounded-md ">
                <NavLink to={"/admin"}>Dashboard</NavLink>{" "}
              </li>
              <li className="p-3 rounded-md ">
                <NavLink to={"/admin/classes"}>All Classes</NavLink>{" "}
              </li>
              <li className="p-3 rounded-md ">
                <NavLink to={"/admin/classes/add"}>Add Class</NavLink>{" "}
              </li>
              <li className="p-3 rounded-md ">
                <NavLink to="/admin/add-student">Add Student </NavLink>{" "}
              </li>
              <li className="p-3 rounded-md ">
                <NavLink to={"/admin/students"}>All Students</NavLink>{" "}
              </li>
              <li className="p-3 rounded-md ">
                <NavLink to={"/admin/timetable"}>Timetable</NavLink>{" "}
              </li>
              <li className="p-3 rounded-md ">
                <NavLink to={"/admin/school"}>School info</NavLink>{" "}
              </li>
              <li className="p-3 rounded-md ">
                <NavLink>Notice Board</NavLink>{" "}
              </li>

              <li className="p-3 rounded-md " onClick={logOut}>
                Log out
              </li>
            </ul>
          </aside>

          <section className="lg:ml-[18%] w-full min-h-screen">
            {schoolInfo?.session?.endDate && (
              <p className="p-2 bg-gray-300 text-sm">{`${
                schoolInfo.session.term
              } term of the ${schoolInfo.session.year} session ends 
      ${new Date(schoolInfo.session.endDate).toDateString()}`}</p>
            )}
            <Outlet />
          </section>
        </main>
      )}
    </>
  );
};

export default Layout;
