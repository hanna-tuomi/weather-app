let w;
let iconImages = { };

function setup() {
  windowRatio(414, 848);  // use the size of your phone
  frameRate(1);
  angleMode(DEGREES);  // use 0..360 instead of 0..2π
  colorMode(RGB, 255, 255, 255, 1); 
  w = requestWeather(42.3596764, -71.0958358); //MIT weather now
  //w = requestWeather(43.65, -79.34); //Toronto 
  //w = requestWeather(-3.465, -62.215); //Amazon rainforest
}

// download the icons for eather before
function preload() {
  iconImages['clear-day'] = loadImage('icons/clear-day.svg');
  iconImages['clear-night'] = loadImage('icons/clear-night.svg');
  iconImages['cloudy'] = loadImage('icons/cloudy.svg');
  iconImages['fog'] = loadImage('icons/fog.svg');
  iconImages['partly-cloudy-day'] = loadImage('icons/partly-cloudy-day.svg');
  iconImages['partly-cloudy-night'] = loadImage('icons/partly-cloudy-night.svg');
  iconImages['rain'] = loadImage('icons/rain.svg');
  iconImages['sleet'] = loadImage('icons/sleet.svg');
  iconImages['snow'] = loadImage('icons/snow.svg');
  iconImages['wind'] = loadImage('icons/wind.svg');
}

function draw() {
  updateRatio();
  background(255);
 
 // set up
  let steps = 12;
  let centerX = rwidth/2;
  let centerY = rheight/2;
 
  let startAngle = -90;
  let stopAngle = 270;
  
  // proportions for circles
  let hourRadius = rwidth * 0.7;
  let innerRadius = hourRadius* 0.55;
  let rainRadius = rwidth*0.6;
  let max_cloudRadius = rwidth;
  let min_cloudRadius = rwidth * 0.8;
  let clockRadius = rwidth*0.55;
  
  // hour-based dimensions (clock-based)
  let minRatio = minute()/60;
  let hourMin = hour()%12 + minRatio;
  let hourAngle = map(hourMin, 0, 12, startAngle, stopAngle);
  let hourDiv = map(hour() % 12, 0, 12, startAngle, stopAngle);
  let hourx = centerX + clockRadius*cos(hourAngle);
  let houry = centerY + clockRadius*sin(hourAngle);
  
  if (w.ready) {
    
    // get the weather data
    let temps = w.getTemperature('hourly');
    let precipProb= w.getPrecipProbability('hourly');
    let clouds = w.getCloudCover('hourly');
    print(temps);
    print(precipProb);
    print(clouds);
   
    let sat;
    
    //cloud cover
    for (let i = 0; i < steps; i++) {
      
      //get out shade to indicate certainty of the prediction
      if (i <= 6){
        sat = 1;
      }
      if (i > 6){
        sat = 1 - (((i-6)*18)/100);
      }

      let c1 = color(178,216,255, sat); // clear
      let c2 = color(84, 104, 124, sat); // very dark/cloudy
      
      amount = clouds[i];
      c = lerpColor(c1, c2, amount);
      
      let startangle = map(i, 0, 12, hourDiv, (hourDiv + 360)) + 0.5;
      let endangle = map(i+1, 0, 12,hourDiv, (hourDiv + 360)) - 0.5;
      let dif_cloud = (endangle - startangle)*amount;
      let new_end = startangle + dif_cloud;
      
      // gray arcs
      noStroke();
      fill(c);
      arc(centerX, centerY, max_cloudRadius, max_cloudRadius, startangle, new_end);

      // interior circle
      noStroke();
      fill(255);
      ellipse(centerX, centerY, min_cloudRadius*1.15, min_cloudRadius*1.15);
   
    }
    
    //rain prob
    for (let i = 0; i < steps; i++) {
      
      //get out shade to indicate certainty of the prediction
      if (i <= 6){
        sat = 1;
      }
      if (i > 6){
        sat = 1 - (((i-6)*18)/100);
      }

      let c1 = color(150, 202, 255, sat); // clear
      let c2 = color(0, 58, 153, sat); // likely to rain
      
      amount = precipProb[i];
      c = lerpColor(c1, c2, amount);
      
      let startangle = map(i, 0, 12, hourDiv, (hourDiv + 360)) + 0.75;
      let endangle = map(i+1, 0, 12,hourDiv, (hourDiv + 360)) - 0.75;
      let dif_precip = (endangle - startangle)*amount;
      let new_end = startangle + dif_precip;
      
      // 
      noStroke();
      fill(c);
      arc(centerX, centerY, min_cloudRadius*1.05, min_cloudRadius*1.05, startangle, new_end);
    
      // interior circle
      noStroke();
      fill(255);
      ellipse(centerX, centerY, rainRadius*1.25, rainRadius*1.25);
   
    }
    
    //temperature hours
    for (let i = 0; i < steps; i++) {
 
      //get out shade to indicate certainty of the prediction
      if (i <= 6){
        sat = 1;
      }
      if (i > 6){
        sat = 1 - (((i-6)*18)/100);
      }
      
      // create a gradient for the various families
      let c1 = color(0, 15*1.3, 87*1.3, sat); // very cold  (under 20 deg)
      let c2 = color(50*1.3, 49*1.3, 172*1.3, sat); // cold  (20 - 40)
      let c3 = color(8*1.3, 160*1.3, 0*1.3, sat);  // pleasant (40-60)
      let c4 = color(255*1.3, 168*1.3, 0*1.3, sat);  // warm (60 - 80)
      let c5 = color(223*1.3, 0*1.3, 40*1.3, sat); // vert hot (80+)
      
      
      if (temps[i] < 20) {
        c = c1;
      } else if (temps[i] >= 20 && temps[i] < 40) {
        amount = map(temps[i], 20, 40, 0, 1);
        c = lerpColor(c1, c2, amount);
      } else if (temps[i] >= 40 && temps[i] < 60) {
        amount = map(temps[i], 40, 60, 0, 1);
        c = lerpColor(c2, c3, amount);
      } else if (temps[i] >= 60 && temps[i] < 80) {
        amount = map(temps[i], 60, 80, 0, 1);
        c = lerpColor(c3, c4, amount);
      } else if (temps[i] >= 80 && temps[i] < 100) {
        c = lerpColor(c4, c5, amount);
      } else if (temps[i] >= 80 && temps[i] < 100) {
        c = c5;
      }
      
      let startangle = map(i, 0, 12, hourDiv, (hourDiv + 360)) + 1;
      let endangle = map(i+1, 0, 12,hourDiv, (hourDiv + 360)) - 1;
      
      noStroke(); 
      fill(c);
      arc(centerX, centerY, hourRadius, hourRadius, startangle, endangle);
    }
    
    // interior circle
    noStroke();
    fill(255);
    ellipse(centerX, centerY, innerRadius + 30, innerRadius + 30);
    
    // clock line
    let cstartx = centerX + (innerRadius-80)*cos(hourAngle);
    let cstarty = centerY + (innerRadius-80)*sin(hourAngle);
    strokeWeight(7);
    stroke(0);
    line(cstartx, cstarty, hourx, houry);
    
  
    let name = w.getIcon();
    
    // get the image with this name
    let icon = iconImages[name];
    
    // draw that icon
    let iconSize = rwidth/3;
    let upperx = rwidth/2 - (iconSize/2) + 3;
    let uppery = rheight/2 - (iconSize/2) + 10;
    image(icon, upperx, uppery, iconSize, iconSize);
    
  } 
}
