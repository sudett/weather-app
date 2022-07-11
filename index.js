const wrapper = document.getElementById("wrapper");

const fetchCities = async () => {
  try {
    const citiesJSON = await fetch("./api/cities.json");
    const temperature = await fetch(`./api/temperatures/`);
    const cities = await citiesJSON.json();

    await Promise.all(
      cities.list.map(async (city) => {
        try {
          const tempJson = await fetch(`./api/temperatures/${city.cid}`);

          if (tempJson.status !== 200) {
            throw new Error("-");
          }
          const temp = await tempJson.json();
          city.temperature = temp;
          return temp;

          // console.log(city);
        } catch (e) {
          city.temperature = "-";
          // console.log(e);
          return "-";
        }
        return 0;
      })
    );

    const newTempsJSON = await fetch("./api/tempretures.json");
    const newTemps = await newTempsJSON.json();
    // console.log(newTemps);

    newTemps.list.forEach((temp) => {
      cities.list.forEach((city) => {
        if (temp.cid === city.cid) city.temperature = temp.temperature;
      });
    });

    const citiesSet = new Set(cities.list.map((city) => city.province));
    const newArr = Array.from(citiesSet).map((province) => {
      return cities.list.filter((city) => city.province === province);
    });

    // console.log(newArr);

    newArr.forEach((arr) => {
      const markup = `
        <div class="province">
          <h2>${arr[0].province}</h2>
          ${arr
            .map((item) => {
              let descTemp;
              if (item.temperature < 10) descTemp = "cold";
              else if (item.temperature >= 10 && item.temperature < 30)
                descTemp = "nutral";
              else if (item.temperature >= 30) descTemp = "hot";

              return `<div class="city">
              <h3>${item.name}</h3>
              <span class="temperature ${descTemp}">${item.temperature}</span>
            </div>`;
            })
            .join("")}
          
        </div>
      `;

      wrapper.insertAdjacentHTML("beforeend", markup);
    });
  } catch (err) {
    console.log(err);
  }
};

fetchCities();
