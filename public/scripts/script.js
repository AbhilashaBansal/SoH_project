let hospital_data;
async function getData(){
    await $.get('/show_hospitals', (data)=>{
        // console.log("Hospitals Data: ", data);
        hospital_data = data;
    })
}

// const str1 = '<div class="col-lg-4 col-md-5 col-sm-6 col-xs-12"> <div class="card"> <img class="card-img-top" src="./Images/sample_photo.png" alt="Card image"> <div class="card-body"> <h5 class="card-title">';

getData().then(()=>{
    for(let i=0; i<hospital_data.length; i++){
        $('#hospital-list').append(
            '<li style="padding:2%; margin: 10px 0; background-color:lightblue; border-radius:25px">' + hospital_data[i].name + ', ' + hospital_data[i].locality + ', ' + hospital_data[i].city + 
            '</li> <a href="/hosp?id=' + hospital_data[i].id + '" id="' + hospital_data[i].id + '" class="hosp btn btn-primary"' + 
            '> View More </a>'

        );
    }
}).catch((err)=>{
    if (err) throw err;
})
