export default function getCurrentDate (){
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    
    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${year}-${month}-${day}`;
    
    // console.log(currentDate); // "17-6-2022"

    return currentDate
}