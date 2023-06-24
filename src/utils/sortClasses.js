export default function sortClasses (classes){

    // let classList = [{: 'SS 1'}, {:'Primary 5'}, {:'JS 1'}, {:'Primary 4'}]
      // classList.push({...newClassDetails, key:hashedPassword})

      const primaryClasses = classes.filter(el=> el.includes('Primary'))
      const secondaryClasses = classes.filter(el=> el.includes('S'))

      primaryClasses.sort(function (a, b) {
        if (a < b) {return -1;}
        if (a > b) { return 1;}
        return 0;


      });

      secondaryClasses.sort(function (a, b) {
        if (a < b) {return -1;}
        if (a > b) { return 1;}
        return 0;
      });



      console.log(...primaryClasses, ...secondaryClasses)

      return [...primaryClasses, ...secondaryClasses]

}