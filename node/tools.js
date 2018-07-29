
exports.hash = function (passwordString, salt) {
    var flag = true;
    var num1 = 0x0;
    var num2 = 0x0;
    var password = parseInt(passwordString, 10);
    
    for (var c in salt) {
        c = salt[c];
        if (c!='0') {
            if (flag) num2 = password;
            flag = false;
        }
        switch (c) {
            case '1':
                num1 = num2 & 0xFFFFFF80;
                num1 = num1 >>> 7;
                num2 = num2 << 25;
                num1 = num1 + num2;
                break;
            case '2':
                num1 = num2 & 0xFFFFFFF0;
                num1 = num1 >>> 4;
                num2 = num2 << 28;
                num1 = num1 + num2;
                break;
            case '3':
                num1 = num2 & 0xFFFFFFF8;
                num1 = num1 >>> 3;
                num2 = num2 << 29;
                num1 = num1 + num2;
                break;
            case '4':
                num1 = num2 << 1;
                num2 = num2 >>> 31;
                num1 = num1 + num2;
                break;
            case '5':
                num1 = num2 << 5;
                num2 = num2 >>> 27;
                num1 = num1 + num2;
                break;
            case '6':
                num1 = num2 << 12;
                num2 = num2 >>> 20;
                num1 = num1 + num2;
                break;
            case '7':
                num1 = num2 & 0x0000FF00;
                num1 = num1 + (( num2 & 0x000000FF ) << 24 );
                num1 = num1 + (( num2 & 0x00FF0000 ) >>> 16 );
                num2 = ( num2 & 0xFF000000 ) >>> 8;
                num1 = num1 + num2;
                break;
            case '8':
                num1 = num2 & 0x0000FFFF;
                num1 = num1 << 16;
                num1 = num1 + ( num2 >>> 24 );
                num2 = num2 & 0x00FF0000;
                num2 = num2 >>> 8;
                num1 = num1 + num2;
                break;
            case '9':
                num1 = ~num2;
                break;
            case '0':
                num1 = num2;
                break;
        }
        num2 = num1;
    }
    return (num1 >>> 0).toString();
};
