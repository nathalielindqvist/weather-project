

async function getSmhi() {
    try {
        const response = await fetch("https://opendata-download-metobs.smhi.se/api/version/latest/parameter/1.json");
        const data = await response.json();
        console.log(data);

    
        let appList = document.getElementById("ulList");
        for(let i = 0; i < data.station.length; i++){
            let listItem = document.createElement("li");
            listItem.setAttribute("class", "listClass");
            listItem.innerHTML = data.station[i].name;
            let listButton = document.createElement("button");
            listButton.setAttribute("class", "listButton");
            listButton.innerHTML = "Button";
            appList.appendChild(listItem).appendChild(listButton);

            listButton.addEventListener("click", function (e) {
                clickedLongitute = Math.round(data.station[i].longitude);
                clickedLatitude = Math.round(data.station[i].latitude);
                console.log(data.station[i].name)
                getTown(clickedLongitute, clickedLatitude);


            })

        }




        async function getTown(long, lat) {
            try {
                const townResponse = await fetch("https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" + long + "/lat/" + lat + "/data.json");
                const townData = await townResponse.json();
                console.log(townData);
                console.log(townData.timeSeries[2].parameters[11].values);


            } catch (error) {
                console.error(error);
            }

        }

    } catch (error) {
        console.error(error);
    }
}

getSmhi();