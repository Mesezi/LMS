export default function splitString(input) {
    if (input === null || input === undefined) {
      return null;
    }
  
    const parts = input.split('-');
    if (parts.length === 2) {
      return {
        school: parts[0],
        type: parts[1]
      };
    } else {
      return null;
    }
  }