let hospital_data;
async function getData(){
    await $.get('/show_hospitals', (data)=>{
        console.log("Hospitals Data: ", data);
        hospital_data = data;
    })
}

// const str1 = '<div class="col-lg-4 col-md-5 col-sm-6 col-xs-12"> <div class="card"> <img class="card-img-top" src="./Images/sample_photo.png" alt="Card image"> <div class="card-body"> <h5 class="card-title">';
const str = '<li> </li>'

getData().then(()=>{
    for(let i=0; i<hospital_data.length; i++){
        $('#hospital-list').append(
            '<li style="margin:2%;">' + hospital_data[i].name + ' ' + hospital_data[i].city + ' ' + hospital_data[i].locality + ' <a href="/hosp?id=' + hospital_data[i].id + '" id="' + hospital_data[i].id + '" class="hosp btn btn-primary"' + '> View More </a> </li>'
            // str1 + freedata[i].name + '</h5> <p class="card-text">Field: ' + freedata[i].domain + '</p>' +
            // '<p class="card-text">Skills: ' + freedata[i].skills + '</p>' +
            // '<p class="card-text">Projects: ' + freedata[i].projects + '</p>' +
            // '<a href="/profiles/free?id=' + freedata[i].id + '" class="btn btn-primary">View Profile</a> </div> </div>' 
        );
    }
}).catch((err)=>{
    if (err) throw err;
})
