const bcrypt = require('bcrypt')


async function run(){
    //1st argument => number of rounds require to genreate salt , higher the number , time take more , harder to hack

    const salt = await bcrypt.genSalt(10)

    const hashed = await bcrypt.hash('1234',salt)
    
    console.log(hashed)
}


//123 => hash => abcd , 123 => hash => abcd , to get both different we use salt which add some more string in it

run()