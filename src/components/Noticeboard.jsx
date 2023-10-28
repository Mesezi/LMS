import { useSelector } from "react-redux";
import "react-calendar/dist/Calendar.css";
import getCurrentDate from "../utils/getCurrentDate";
import { doc, updateDoc } from "firebase/firestore";
import { database } from "../../fireBaseConfig";

const Noticeboard = () => {
  const schoolInfo = useSelector((state) => state.schoolInfo);
  const userDetails = useSelector((state) => state.user.userDetails);

  const handleInput = (e) => {
    setNoticeForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const submitNewNotice = async (e) => {
    e.preventDefault();

    const id = new Date().getTime(); // set new notice id with time
    const docRef = doc(database, `SCHOOLS/${userDetails.school}`);

    try {
      await updateDoc(docRef, {
        notices: {
          ...schoolInfo.notices,
          [id]: { ...noticeForm, timestamp: getCurrentDate() },
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotice = async (id) => {
    let updatedNotices = { ...schoolInfo.notices };
    delete updatedNotices[id];

    const docRef = doc(database, `SCHOOLS/${userDetails.school}`);

    try {
      await updateDoc(docRef, {
        notices: updatedNotices,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const readMessage = async (key) => {
    console.log(userDetails.type)
    if (!userDetails.latestNoticeId.includes(key)) {
      console.log(key);
      const docRef = doc(
        database,
        userDetails.type === 'class' ? 
        `SCHOOLS/${userDetails.school}/CLASSES/${userDetails.className}` :
        `SCHOOLS/${userDetails.school}/STUDENTS/${userDetails.email}`
      );

      try {
        await updateDoc(docRef, {
          latestNoticeId: [...userDetails.latestNoticeId, key],
        });
        console.log("done");
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (userDetails?.type === "admin")
    return (
      <section>
        <h4>Notice board</h4>
        {
          // console.log(schoolInfo?.notices)
          schoolInfo &&
            Object.keys(schoolInfo.notices)
              .sort()
              .reverse()
              .map((key) => (
                <div className="my-5" key={key}>
                  <h3>
                    {schoolInfo.notices[key].title}
                    <span className="ml-4 text-sm">
                      {schoolInfo.notices[key].timestamp}
                    </span>
                  </h3>
                  <p>
                    {schoolInfo.notices[key].content}{" "}
                    <span
                      onClick={() => deleteNotice(key)}
                      className="ml-6 underline text-red-400 text-sm"
                    >
                      delete
                    </span>
                  </p>
                </div>
              ))
        }

        {/* Add to notice board*/}
        <form
          onSubmit={(e) => submitNewNotice(e)}
          className="flex flex-col gap-2 w-60"
        >
          <input
            type="text"
            name="title"
            placeholder="title"
            onChange={(e) => handleInput(e)}
          />
          <textarea
            type="text"
            name="content"
            placeholder="content"
            onChange={(e) => handleInput(e)}
          />
          {/* <input type="date" name='timestamp' onChange={(e)=>console.log(e.target.value)}/> */}

          <button>Add</button>
        </form>
      </section>
    );

  return (
    <section>
      <h4>Notice board </h4>

      {
        // console.log(schoolInfo?.notices)
        schoolInfo &&
          Object.keys(schoolInfo.notices)
            .sort()
            .reverse()
            .map((key) => (
              <div
                onClick={() => readMessage(key)}
                className={`my-5 ${
                  !userDetails.latestNoticeId.includes(key) && "bg-black/40"
                }`}
                key={key}
              >
                <h3>
                  {schoolInfo.notices[key].title}
                  <span className="ml-4 text-sm">
                    {schoolInfo.notices[key].timestamp}
                  </span>
                </h3>
                <p>{schoolInfo.notices[key].content}</p>
              </div>
            ))
      }
    </section>
  );
};

export default Noticeboard;
