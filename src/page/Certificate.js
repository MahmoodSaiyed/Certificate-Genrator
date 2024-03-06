import React from 'react';
import img1 from '../image/unesco.png'
import img2 from '../image/education-2030.png'
import img3 from '../image/certificate_title.png'
import sign1 from '../image/sign1.png'
import sign2 from '../image/sign2.png'
import '../style/style.css'; // Import your CSS file
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Certificate(props) {
    return (
        <div class="maincertificate my-2" id='template1'> 
        <div class="certificate">
            <div class="row">
                <div class="col">
                <img src={img2} alt="education 2030" style={{ maxWidth: "150px" }} />
                </div>
                <div class="col ">
                    <img src={img1} width="147" alt="unesco" class="ms-3 ps-1"/>
                </div>
                <div class="col"></div>
            </div>
            <div class="text-center mt-4">
                <img src={img3} width="290" alt="" class="mt-1 "/>
            </div>
            <div class="text-center mt-4">
                <p class="pt-1 mb-0">This Certificate Recognises</p>
            </div>
            <div class="text-center mt-2" id='info'>
                <h1 style={{fontSize:`${props.fontSize}px`,fontFamily:`${props.fontFamily}`}} class="mb-0 pt-1">{props.name=== ''? 'Yashika Sahu' : props.name}</h1>
            </div>
            <div>
                <hr/>
            </div>
            <div id='info' class="text-center">
                <p class="description">{props.desc === ''? 'Student of Anand Niketan Shilaj, Ahmedabad': props.desc}</p>
                <p class="description">{props.desc1 === '' ? 'for successfully participating in a Balaram Trip on 10th January 2024': props.desc1}</p>
                <p class="description">{props.desc2 === '' ? 'to promote Intangible Cultural Heritage' : props.desc2}</p>
            </div>
            <div class="d-flex signature justify-content-between">
                <div class="text-center ps-3">
                    <img src={sign1} height="48" class="change-my-color" alt=''/>
                    <hr/>
                    <p class="mb-0 name">Tim Curtis</p>
                    <p class="mb-0 description">Director General<br/> UNESCO</p>
                </div>
                <div class="text-center">
                    <img src={sign2} height="48" class="change-my-color" alt=''/>
                    <hr class="w-75"/>
                    <p class="mb-0 name">Parvez Malik</p>
                    <p class="mb-0 description">ASPnet Programme Officer<br/> UNESCO</p>
                </div>
            </div>
        </div>
    </div>    );
}

export default Certificate;
