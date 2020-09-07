export const formatDate = (date: Date) => {
    const month = date.getMonth()
    const day = date.getDate()
    const hours = date.getHours() > 12
        ? date.getHours() - 12
        : date.getHours()
    const am_pm = date.getHours() > 12
        ? 'pm'
        : 'am'
    const minutes = date.getMinutes() > 10
        ? date.getMinutes()
        : '0' + date.getMinutes()
    const newDate = month + 1 + '/' + day + ' at: ' + hours + ':' + minutes + am_pm
    return newDate;
}

export const formatPhoneNumber = (number: string) => {

    var phoneRegex = /^(?:\+[1-9][-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    if (phoneRegex.test(number)) {
        var formattedPhoneNumber = number.replace(phoneRegex, "($1) $2-$3");
        return formattedPhoneNumber;
    }
}

export const littleFormat = (number: string) => {
    const newNumber = number;
    if(newNumber.length < 3 && newNumber.length > 0){
        return ('(' + newNumber)
    }else if(newNumber.length === 3){
        return ('(' + newNumber + ')')
    }else if(6 >= newNumber.length && newNumber.length > 3){
        return '(' + newNumber.substring(0,3) +') '+ newNumber.substring(3,newNumber.length)
    }else if(newNumber.length > 6){
        return '(' + newNumber.substring(0,3) +') '+ newNumber.substring(3,6) + '-' + newNumber.substring(6,newNumber.length);
    }else{
        return number
    }

}