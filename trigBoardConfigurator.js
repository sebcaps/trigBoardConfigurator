
//globals
let blueToothRXCharacteristic;//this is a blu
let blueToothTXCharacteristic;//this is a blu

let blueTooth;
let isConnected = false;
let connectButton;

let trigBoardImg;
let trigBoardlogoImg;
//status variables
let newData=false;
let wifiConnected = false;
let batteryVoltage=0.0;
let contactOpen = false;
let buttonPressed = false;
let LEDblinkStartTime;
let OTAinProgress=" ";
let OTAisActive = false;
let firstConnected = true;
let udpEnabled = false;
let tcpEnabled = false;

function preload() {
  trigBoardImg = loadImage('data/trigBoard.png');
  trigBoardlogoImg = loadImage('data/trigBoardlogo.png');
}


function setup() {

  // Create a p5ble class
  console.log("setting up");
  blueTooth = new p5ble();

  connectButton = createButton('CONNECT');
  connectButton.mousePressed(connectToBle);
  connectButton.position(15, 150);
  connectButton.style('color', color(255));
  connectButton.style('background-color', color(77, 158, 106));

  LEDblinkStartTime=millis();

  killButton = createButton('DISCONNECT');
  killButton.position(15, 150);
  killButton.style('color', color(255));
  killButton.style('background-color', color(208, 93, 73));
  killButton.mousePressed(killCommand);

  otaStartButton = createButton('Initialize OTA');
  otaStartButton.position(15, 180);
  otaStartButton.mousePressed(otaStartCommand);

  readDocsButton = createButton('REFERENCE');
  readDocsButton.position(380, 150);
  readDocsButton.style('color', color(255));
  readDocsButton.style('background-color', color(62, 129, 182));
  readDocsButton.mousePressed(readDocsCommand);

  contactButton = createButton('CONTACT<br>or<br>REPORT ISSUES');
  contactButton.position(380, 180);
  contactButton.style('color', color(255));
  contactButton.style('background-color', color(62, 129, 182));
  contactButton.mousePressed(contactCommand);

  let yPositionStart = 600;
  ssidTitle = createElement('h3', 'WiFi SSID (2.4GHz)');
  ssidTitle.position(10, yPositionStart);
  ssidInput = createInput('');
  ssidInput.position(ssidTitle.size().width+ssidTitle.x+10, ssidTitle.size().height+ssidTitle.y);

  ssidPw = createElement('h3', 'WiFi Password');
  ssidPw.position(10, ssidTitle.size().height+ssidTitle.y);
  pwInput = createInput('', 'password');
  pwInput.position(ssidPw.size().width+ssidPw.x+10, ssidPw.size().height+ssidPw.y);  
  WiFiButton = createButton('Save and Connect with DHCP');
  WiFiButton.position(pwInput.x+pwInput.width, pwInput.y);
  WiFiButton.mousePressed(saveWiFi);
  //**************************************
  staticEnableTitle = createElement('h4', 'Static IP: ');
  staticEnableTitle.position(10, ssidPw.size().height+ssidPw.y+5);
  staticEnableCheckbox = createCheckbox('', false);
  staticEnableCheckbox.position(staticEnableTitle.size().width+staticEnableTitle.x+10, staticEnableTitle.size().height+staticEnableTitle.y);
  staticEnableButton = createButton('Save');
  staticEnableButton.position(staticEnableTitle.size().width+staticEnableTitle.x+40, staticEnableTitle.size().height+staticEnableTitle.y);
  staticEnableButton.mousePressed(staticEnableCommand);
  //**************************************
  staticIPTitle = createElement('h4', 'Static IP:');
  staticIPTitle.position(50, staticEnableTitle.size().height+staticEnableTitle.y+5);
  staticIPInput = createInput('');
  staticIPInput.position(staticIPTitle.size().width+staticIPTitle.x+10, staticIPTitle.size().height+staticIPTitle.y);
  staticGatewayTitle = createElement('h4', 'Gateway:');
  staticGatewayTitle.position(50, staticIPTitle.size().height+staticIPTitle.y+5);
  staticGatewayInput = createInput('');
  staticGatewayInput.position(staticGatewayTitle.size().width+staticGatewayTitle.x+10, staticGatewayTitle.size().height+staticGatewayTitle.y);
  staticSubnetTitle = createElement('h4', 'Subnet:');
  staticSubnetTitle.position(50, staticGatewayTitle.size().height+staticGatewayTitle.y+5);
  staticSubnetInput = createInput('');
  staticSubnetInput.position(staticSubnetTitle.size().width+staticSubnetTitle.x+10, staticSubnetTitle.size().height+staticSubnetTitle.y);
  staticPrimaryDNSTitle = createElement('h4', 'Primary DNS:');
  staticPrimaryDNSTitle.position(50, staticSubnetTitle.size().height+staticSubnetTitle.y+5);
  staticPrimaryDNSInput = createInput('');
  staticPrimaryDNSInput.position(staticPrimaryDNSTitle.size().width+staticPrimaryDNSTitle.x+10, staticPrimaryDNSTitle.size().height+staticPrimaryDNSTitle.y);
  staticSecondaryDNSTitle = createElement('h4', 'Secondary DNS:');
  staticSecondaryDNSTitle.position(50, staticPrimaryDNSTitle.size().height+staticPrimaryDNSTitle.y+5);
  staticSecondaryDNSInput = createInput('');
  staticSecondaryDNSInput.position(staticSecondaryDNSTitle.size().width+staticSecondaryDNSTitle.x+10, staticSecondaryDNSTitle.size().height+staticSecondaryDNSTitle.y);
  staticSaveButton = createButton('Save and Connect with Static IP');
  staticSaveButton.position(staticSecondaryDNSInput.size().width+staticSecondaryDNSInput.x, staticSecondaryDNSInput.y);
  staticSaveButton.mousePressed(staticSaveCommand);
  //**************************************
  wifiTimeoutTitle = createElement('h4', 'WiFi Timeout (seconds 1-60)');
  wifiTimeoutTitle.position(10, staticSecondaryDNSTitle.size().height+staticSecondaryDNSTitle.y+5);
  wifiTimeoutInput = createInput('');
  wifiTimeoutInput.size(30);
  wifiTimeoutInput.position(wifiTimeoutTitle.size().width+wifiTimeoutTitle.x+10, wifiTimeoutTitle.size().height+wifiTimeoutTitle.y);  
  wifiTimeoutButton = createButton('Save');
  wifiTimeoutButton.position(wifiTimeoutInput.x+wifiTimeoutInput.width, wifiTimeoutInput.y);
  wifiTimeoutButton.mousePressed(wifiTimeoutCommand);
  //**************************************
  trigBoardNameTitle = createElement('h4', 'trigBoard Name');
  trigBoardNameTitle.position(10, wifiTimeoutTitle.size().height+wifiTimeoutTitle.y+5);
  trigBoardNameInput = createInput('');
  trigBoardNameInput.position(trigBoardNameTitle.size().width+trigBoardNameTitle.x+10, trigBoardNameTitle.size().height+trigBoardNameTitle.y);  
  trigBoardNameButton = createButton('Save');
  trigBoardNameButton.position(trigBoardNameInput.x+trigBoardNameInput.width, trigBoardNameInput.y);
  trigBoardNameButton.mousePressed(trigBoardNameCommand);
  //**************************************
  trigTriggerSelectionTitle = createElement('h4', 'Wake on:');
  trigTriggerSelectionTitle.position(10, trigBoardNameTitle.size().height+trigBoardNameTitle.y+5);
  triggerSelector = createSelect();
  triggerSelector.position(trigTriggerSelectionTitle.x+trigTriggerSelectionTitle.size().width+10, trigTriggerSelectionTitle.size().height+trigTriggerSelectionTitle.y);
  triggerSelector.option('Contact Close');
  triggerSelector.option('Contact Open');
  triggerSelector.option('Open and Close');
  triggerSelectorButton = createButton('Save');
  triggerSelectorButton.position(triggerSelector.x+triggerSelector.width+100, triggerSelector.y);
  triggerSelectorButton.mousePressed(triggerSelectorCommand);
  //**************************************
  highSpeedEnableTitle = createElement('h4', 'High Speed Trigger: ');
  highSpeedEnableTitle.position(10, trigTriggerSelectionTitle.size().height+trigTriggerSelectionTitle.y+5);
  highSpeedEnableCheckbox = createCheckbox('', false);
  highSpeedEnableCheckbox.position(highSpeedEnableTitle.size().width+highSpeedEnableTitle.x+10, highSpeedEnableTitle.size().height+highSpeedEnableTitle.y);
  highSpeedEnableButton = createButton('Save');
  highSpeedEnableButton.position(highSpeedEnableTitle.size().width+highSpeedEnableTitle.x+40, highSpeedEnableTitle.size().height+highSpeedEnableTitle.y);
  highSpeedEnableButton.mousePressed(highSpeedCommand);
  //**************************************
  triggerOpensTitle = createElement('h4', 'Message when Contact Opens:');
  triggerOpensTitle.position(10, highSpeedEnableTitle.size().height+highSpeedEnableTitle.y+5);
  triggerOpensInput = createInput('');
  triggerOpensInput.position(triggerOpensTitle.size().width+triggerOpensTitle.x+10, triggerOpensTitle.size().height+triggerOpensTitle.y);  
  triggerOpensButton = createButton('Save');
  triggerOpensButton.position(triggerOpensInput.x+triggerOpensInput.width, triggerOpensInput.y);
  triggerOpensButton.mousePressed(triggerOpensCommand);
  //**************************************
  triggerClosesTitle = createElement('h4', 'Message when Contact Closes:');
  triggerClosesTitle.position(10, triggerOpensTitle.size().height+triggerOpensTitle.y+5);
  triggerClosesInput = createInput('');
  triggerClosesInput.position(triggerClosesTitle.size().width+triggerClosesTitle.x+10, triggerClosesTitle.size().height+triggerClosesTitle.y);  
  triggerClosesButton = createButton('Save');
  triggerClosesButton.position(triggerClosesInput.x+triggerClosesInput.width, triggerClosesInput.y);
  triggerClosesButton.mousePressed(triggerClosesCommand);
  //**************************************
  wakeButtonTitle = createElement('h4', 'Message when Wake Button Pressed:');
  wakeButtonTitle.position(10, triggerClosesTitle.size().height+triggerClosesTitle.y+5);
  wakeButtonInput = createInput('');
  wakeButtonInput.position(wakeButtonTitle.size().width+wakeButtonTitle.x+10, wakeButtonTitle.size().height+wakeButtonTitle.y);  
  wakeButtonButton = createButton('Save');
  wakeButtonButton.position(wakeButtonInput.x+wakeButtonInput.width, wakeButtonInput.y);
  wakeButtonButton.mousePressed(wakeButtonCommand);
  //**************************************
  timerUnitTitle = createElement('h4', 'Timer Units: ');
  timerUnitTitle.position(10, wakeButtonTitle.size().height+wakeButtonTitle.y+5);
  timerUnitSelector = createSelect();
  timerUnitSelector.position(timerUnitTitle.x+timerUnitTitle.size().width+10, timerUnitTitle.size().height+timerUnitTitle.y);
  timerUnitSelector.option('Minutes');
  timerUnitSelector.option('Seconds');
  timerUnitSelectorButton = createButton('Save');
  timerUnitSelectorButton.position(timerUnitSelector.x+timerUnitSelector.width+50, timerUnitSelector.y);
  timerUnitSelectorButton.mousePressed(timerUnitSelectorCommand);
  //**************************************
  timerTitle = createElement('h4', 'Timer Wake Time (1-255)');
  timerTitle.position(10, timerUnitTitle.size().height+timerUnitTitle.y+5);
  timerInput = createInput('');
  timerInput.size(50);
  timerInput.position(timerTitle.size().width+timerTitle.x+10, timerTitle.size().height+timerTitle.y);  
  timerButton = createButton('Save');
  timerButton.position(timerInput.x+timerInput.width, timerInput.y);
  timerButton.mousePressed(timerCommand);
  //**************************************
  timerSelectionTitle = createElement('h4', 'Timer Checks for Lo-Battery and: ');
  timerSelectionTitle.position(10, timerTitle.size().height+timerTitle.y+5);
  timerSelector = createSelect();
  timerSelector.position(timerSelectionTitle.x+timerSelectionTitle.size().width+10, timerSelectionTitle.size().height+timerSelectionTitle.y);
  timerSelector.option('Nothing');
  timerSelector.option('Contact Still Closed');
  timerSelector.option('Contact Still Open');
  timerSelector.option('Either Contact');
  timerSelectorButton = createButton('Save');
  timerSelectorButton.position(timerSelector.x+timerSelector.width+100, timerSelector.y);
  timerSelectorButton.mousePressed(timerSelectorCommand);
  //**************************************
  timerStillOpenTitle = createElement('h4', 'Timer Message for Contact still Open:');
  timerStillOpenTitle.position(10, timerSelectionTitle.size().height+timerSelectionTitle.y+5);
  timerStillOpenInput = createInput('');
  timerStillOpenInput.position(timerStillOpenTitle.size().width+timerStillOpenTitle.x+10, timerStillOpenTitle.size().height+timerStillOpenTitle.y);  
  timerStillOpenButton = createButton('Save');
  timerStillOpenButton.position(timerStillOpenInput.x+timerStillOpenInput.width, timerStillOpenInput.y);
  timerStillOpenButton.mousePressed(timerStillOpenCommand);
  //**************************************
  timerStillClosedTitle = createElement('h4', 'Timer Message for Contact still Closed:');
  timerStillClosedTitle.position(10, timerStillOpenTitle.size().height+timerStillOpenTitle.y+5);
  timerStillClosedInput = createInput('');
  timerStillClosedInput.position(timerStillClosedTitle.size().width+timerStillClosedTitle.x+10, timerStillClosedTitle.size().height+timerStillClosedTitle.y);  
  timerStillClosedButton = createButton('Save');
  timerStillClosedButton.position(timerStillClosedInput.x+timerStillClosedInput.width, timerStillClosedInput.y);
  timerStillClosedButton.mousePressed(timerStillClosedCommand);
  //**************************************
  loBatteryTitle = createElement('h4', 'Low Battery Voltage Threshold:');
  loBatteryTitle.position(10, timerStillClosedTitle.size().height+timerStillClosedTitle.y+5);
  loBatteryInput = createInput('');
  loBatteryInput.size(40);
  loBatteryInput.position(loBatteryTitle.size().width+loBatteryTitle.x+10, loBatteryTitle.size().height+loBatteryTitle.y);  
  loBatteryButton = createButton('Save');
  loBatteryButton.position(loBatteryInput.x+loBatteryInput.width, loBatteryInput.y);
  loBatteryButton.mousePressed(loBatteryCommand);
  //**************************************
  pushOverEnableTitle = createElement('h4', 'Pushover Enabled: ');
  pushOverEnableTitle.position(10, loBatteryTitle.size().height+loBatteryTitle.y+5);
  pushOverEnableCheckbox = createCheckbox('', false);
  pushOverEnableCheckbox.position(pushOverEnableTitle.size().width+pushOverEnableTitle.x+10, pushOverEnableTitle.size().height+pushOverEnableTitle.y);
  pushOverEnableButton = createButton('Save');
  pushOverEnableButton.position(pushOverEnableTitle.size().width+pushOverEnableTitle.x+40, pushOverEnableTitle.size().height+pushOverEnableTitle.y);
  pushOverEnableButton.mousePressed(pushOverEnableCommand);
  //**************************************
  pushCredentTitle = createElement('h4', 'Pushover Credentials:');
  pushCredentTitle.position(30, pushOverEnableTitle.size().height+pushOverEnableTitle.y+5);
  pushuserTitle = createElement('h4', 'User Key:');
  pushuserTitle.position(50, pushCredentTitle.size().height+pushCredentTitle.y+5);
  pushuserInput = createInput('', 'password');
  pushuserInput.position(pushuserTitle.size().width+pushuserTitle.x+10, pushuserTitle.size().height+pushuserTitle.y);
  pushapiTitle = createElement('h4', 'API Token/Key:');
  pushapiTitle.position(50, pushuserTitle.size().height+pushuserTitle.y+5);
  pushapiInput = createInput('', 'password');
  pushapiInput.position(pushapiTitle.size().width+pushapiTitle.x+10, pushapiTitle.size().height+pushapiTitle.y);
  pushOverSaveButton = createButton('Save');
  pushOverSaveButton.position(pushapiInput.x+pushapiInput.width, pushapiInput.y);
  pushOverSaveButton.mousePressed(pushOverSaveCommand);
  pushOverTestButton = createButton('Test');
  pushOverTestButton.position(pushOverSaveButton.x+pushOverSaveButton.width, pushapiInput.y);
  pushOverTestButton.mousePressed(pushOverTestCommand);
  //**************************************
  pushSaferEnableTitle = createElement('h4', 'Push Safer Enabled: ');
  pushSaferEnableTitle.position(10, pushapiTitle.size().height+pushapiTitle.y+5);
  pushSaferEnableCheckbox = createCheckbox('', false);
  pushSaferEnableCheckbox.position(pushSaferEnableTitle.size().width+pushSaferEnableTitle.x+10, pushSaferEnableTitle.size().height+pushSaferEnableTitle.y);
  pushSaferEnableButton = createButton('Save');
  pushSaferEnableButton.position(pushSaferEnableTitle.size().width+pushSaferEnableTitle.x+40, pushSaferEnableTitle.size().height+pushSaferEnableTitle.y);
  pushSaferEnableButton.mousePressed(pushSaferEnableCommand);
  //**************************************
  pushSaferTitle = createElement('h4', 'Push Safer Credentials:');
  pushSaferTitle.position(30, pushSaferEnableTitle.size().height+pushSaferEnableTitle.y+5);
  pushSaferKeyTitle = createElement('h4', 'Key:');
  pushSaferKeyTitle.position(50, pushSaferTitle.size().height+pushSaferTitle.y+5);
  pushSaferInput = createInput('', 'password');
  pushSaferInput.position(pushSaferKeyTitle.size().width+pushSaferKeyTitle.x+10, pushSaferKeyTitle.size().height+pushSaferKeyTitle.y);
  pushSaferSaveButton = createButton('Save');
  pushSaferSaveButton.position(pushSaferInput.x+pushapiInput.width, pushSaferInput.y);
  pushSaferSaveButton.mousePressed(pushSaferKeySaveCommand);
  //**************************************
  iftttEnableTitle = createElement('h4', 'ifttt Enabled: ');
  iftttEnableTitle.position(10, pushSaferKeyTitle.size().height+pushSaferKeyTitle.y+5);
  iftttEnableCheckbox = createCheckbox('', false);
  iftttEnableCheckbox.position(iftttEnableTitle.size().width+iftttEnableTitle.x+10, iftttEnableTitle.size().height+iftttEnableTitle.y);
  iftttEnableButton = createButton('Save');
  iftttEnableButton.position(iftttEnableTitle.size().width+iftttEnableTitle.x+40, iftttEnableTitle.size().height+iftttEnableTitle.y);
  iftttEnableButton.mousePressed(iftttEnableCommand);
  //**************************************
  iftttTitle = createElement('h4', 'ifttt Credentials:');
  iftttTitle.position(30, iftttEnableTitle.size().height+iftttEnableTitle.y+5);
  iftttKeyTitle = createElement('h4', 'Maker Key:');
  iftttKeyTitle.position(50, iftttTitle.size().height+iftttTitle.y+5);
  iftttInput = createInput('', 'password');
  iftttInput.position(iftttKeyTitle.size().width+iftttKeyTitle.x+10, iftttKeyTitle.size().height+iftttKeyTitle.y);
  iftttSaveButton = createButton('Save');
  iftttSaveButton.position(iftttInput.x+pushapiInput.width, iftttInput.y);
  iftttSaveButton.mousePressed(iftttKeySaveCommand);
  //**************************************
  //udpEnableTitle = createElement('h4', 'udp enabled: ');
  //udpEnableTitle.position(10, iftttKeyTitle.size().height+iftttKeyTitle.y+5);
  //udpEnableCheckbox = createCheckbox('', false);
  //udpEnableCheckbox.position(udpEnableTitle.size().width+udpEnableTitle.x+10, udpEnableTitle.size().height+udpEnableTitle.y);
  //udpEnableButton = createButton('Save');
  //udpEnableButton.position(udpEnableTitle.size().width+udpEnableTitle.x+40, udpEnableTitle.size().height+udpEnableTitle.y);
  //udpEnableButton.mousePressed(udpEnableCommand);
  //**************************************
  udptcpTitle = createElement('h4', 'udp or tcp: ');
  udptcpTitle.position(10, iftttKeyTitle.size().height+iftttKeyTitle.y+5);
  udptcpSelector = createSelect();
  udptcpSelector.position(udptcpTitle.x+udptcpTitle.size().width+10, udptcpTitle.size().height+udptcpTitle.y);
  udptcpSelector.option('Not Enabled');
  udptcpSelector.option('udp');
  udptcpSelector.option('tcp');
  udptcpSelectorButton = createButton('Save');
  udptcpSelectorButton.position(udptcpSelector.x+udptcpSelector.width+100, udptcpSelector.y);
  udptcpSelectorButton.mousePressed(udptcpSelectorCommand);

  //**************************************
  udpTitle = createElement('h4', 'udp Settings:');
  tcpTitle = createElement('h4', 'tcp Settings: (supported in FW 12/20/20 or newer');
  tcpTitle.position(30, udptcpTitle.size().height+udptcpTitle.y+5);
  udpTitle.position(30, udptcpTitle.size().height+udptcpTitle.y+5);
  udpSSIDTitle = createElement('h4', 'SSID:');
  udpSSIDTitle.position(50, udpTitle.size().height+udpTitle.y+5);
  udpSSIDInput = createInput('');
  udpSSIDInput.position(udpSSIDTitle.size().width+udpSSIDTitle.x+10, udpSSIDTitle.size().height+udpSSIDTitle.y);
  udpPWTitle = createElement('h4', 'Password:');
  udpPWTitle.position(50, udpSSIDTitle.size().height+udpSSIDTitle.y+5);
  udpPWInput = createInput('', 'password');
  udpPWInput.position(udpPWTitle.size().width+udpPWTitle.x+10, udpPWTitle.size().height+udpPWTitle.y);
  udpStaticIPTitle = createElement('h4', 'Static IP:');
  udpStaticIPTitle.position(50, udpPWTitle.size().height+udpPWTitle.y+5);
  udpStaticIPInput = createInput('');
  udpStaticIPInput.position(udpStaticIPTitle.size().width+udpStaticIPTitle.x+10, udpStaticIPTitle.size().height+udpStaticIPTitle.y);
  udpTargetIPTitle = createElement('h4', 'Target IP:');
  udpTargetIPTitle.position(50, udpStaticIPTitle.size().height+udpStaticIPTitle.y+5);
  udpTargetIPInput = createInput('');
  udpTargetIPInput.position(udpTargetIPTitle.size().width+udpTargetIPTitle.x+10, udpTargetIPTitle.size().height+udpTargetIPTitle.y);
  udpPortTitle = createElement('h4', 'Target Port:');
  udpPortTitle.position(50, udpTargetIPTitle.size().height+udpTargetIPTitle.y+5);
  udpPortInput = createInput('');
  udpPortInput.size(50);
  udpPortInput.position(udpPortTitle.size().width+udpPortTitle.x+10, udpPortTitle.size().height+udpPortTitle.y);
  udpGatewayTitle = createElement('h4', 'Gateway:');
  udpGatewayTitle.position(50, udpPortTitle.size().height+udpPortTitle.y+5);
  udpGatewayInput = createInput('');
  udpGatewayInput.position(udpGatewayTitle.size().width+udpGatewayTitle.x+10, udpGatewayTitle.size().height+udpGatewayTitle.y);
  udpSubnetTitle = createElement('h4', 'Subnet:');
  udpSubnetTitle.position(50, udpGatewayTitle.size().height+udpGatewayTitle.y+5);
  udpSubnetInput = createInput('');
  udpSubnetInput.position(udpSubnetTitle.size().width+udpSubnetTitle.x+10, udpSubnetTitle.size().height+udpSubnetTitle.y);
  udpPrimaryDNSTitle = createElement('h4', 'Primary DNS:');
  udpPrimaryDNSTitle.position(50, udpSubnetTitle.size().height+udpSubnetTitle.y+5);
  udpPrimaryDNSInput = createInput('');
  udpPrimaryDNSInput.position(udpPrimaryDNSTitle.size().width+udpPrimaryDNSTitle.x+10, udpPrimaryDNSTitle.size().height+udpPrimaryDNSTitle.y);
  udpSecondaryDNSTitle = createElement('h4', 'Secondary DNS:');
  udpSecondaryDNSTitle.position(50, udpPrimaryDNSTitle.size().height+udpPrimaryDNSTitle.y+5);
  udpSecondaryDNSInput = createInput('');
  udpSecondaryDNSInput.position(udpSecondaryDNSTitle.size().width+udpSecondaryDNSTitle.x+10, udpSecondaryDNSTitle.size().height+udpSecondaryDNSTitle.y);
  tcpReCountTitle = createElement('h4', 'Retries:');
  tcpReCountTitle.position(50, udpSecondaryDNSTitle.size().height+udpSecondaryDNSTitle.y+5);
  udpBlastCountTitle = createElement('h4', 'Blast Count:');
  udpBlastCountTitle.position(50, udpSecondaryDNSTitle.size().height+udpSecondaryDNSTitle.y+5);
  udpBlastCountInput = createInput('');
  udpBlastCountInput.size(30);
  udpBlastCountInput.position(udpBlastCountTitle.size().width+udpBlastCountTitle.x+10, udpBlastCountTitle.size().height+udpBlastCountTitle.y);
  udpBlastTimeTitle = createElement('h4', 'Time Between Blasts (ms):');
  udpBlastTimeTitle.position(50, udpBlastCountTitle.size().height+udpBlastCountTitle.y+5);
  udpBlastTimeInput = createInput('');
  udpBlastTimeInput.size(30);
  udpBlastTimeInput.position(udpBlastTimeTitle.size().width+udpBlastTimeTitle.x+10, udpBlastTimeTitle.size().height+udpBlastTimeTitle.y);
  udpSaveButton = createButton('Save and Connect');
  udpSaveButton.position(udpBlastTimeInput.size().width+udpBlastTimeInput.x+10, udpBlastTimeInput.y);
  udpSaveButton.mousePressed(udpSaveCommand);
  //**************************************
  mqttEnableTitle = createElement('h4', 'mqtt Enabled: ');
  mqttEnableTitle.position(10, udpBlastTimeTitle.size().height+udpBlastTimeTitle.y+5);
  mqttEnableCheckbox = createCheckbox('', false);
  mqttEnableCheckbox.position(mqttEnableTitle.size().width+mqttEnableTitle.x+10, mqttEnableTitle.size().height+mqttEnableTitle.y);
  mqttEnableButton = createButton('Save');
  mqttEnableButton.position(mqttEnableTitle.size().width+mqttEnableTitle.x+40, mqttEnableTitle.size().height+mqttEnableTitle.y);
  mqttEnableButton.mousePressed(mqttEnableCommand);

  //**************************************

  mqttSecEnableTitle = createElement('h4', 'Security Enabled: ');
  mqttSecEnableTitle.position(30, mqttEnableTitle.size().height+mqttEnableTitle.y+5);
  mqttSecEnableCheckbox = createCheckbox('', false);
  mqttSecEnableCheckbox.position(mqttSecEnableTitle.size().width+mqttSecEnableTitle.x+10, mqttSecEnableTitle.size().height+mqttSecEnableTitle.y);
  mqttSecEnableButton = createButton('Save');
  mqttSecEnableButton.position(mqttSecEnableTitle.size().width+mqttSecEnableTitle.x+40, mqttSecEnableTitle.size().height+mqttSecEnableTitle.y);
  mqttSecEnableButton.mousePressed(mqttSecEnableCommand);
  //**************************************
  mqttUserTitle = createElement('h4', 'Username:');
  mqttUserTitle.position(50, mqttSecEnableTitle.size().height+mqttSecEnableTitle.y+5);
  mqttUserInput = createInput('');
  mqttUserInput.position(mqttUserTitle.size().width+mqttUserTitle.x+10, mqttUserTitle.size().height+mqttUserTitle.y);
  mqttPWTitle = createElement('h4', 'Password:');
  mqttPWTitle.position(50, mqttUserTitle.size().height+mqttUserTitle.y+5);
  mqttPWInput = createInput('', 'password');
  mqttPWInput.position(mqttPWTitle.size().width+mqttPWTitle.x+10, mqttPWTitle.size().height+mqttPWTitle.y);

  //**************************************
  mqttTitle = createElement('h4', 'mqtt Settings:');
  mqttTitle.position(30, mqttPWTitle.size().height+mqttPWTitle.y+5);
  mqttPortTitle = createElement('h4', 'Port:');
  mqttPortTitle.position(50, mqttTitle.size().height+mqttTitle.y+5);
  mqttPortInput = createInput('');
  mqttPortInput.position(mqttPortTitle.size().width+mqttPortTitle.x+10, mqttPortTitle.size().height+mqttPortTitle.y);
  mqttServerTitle = createElement('h4', 'Server:');
  mqttServerTitle.position(50, mqttPortTitle.size().height+mqttPortTitle.y+5);
  mqttServerInput = createInput('');
  mqttServerInput.position(mqttServerTitle.size().width+mqttServerTitle.x+10, mqttServerTitle.size().height+mqttServerTitle.y);
  mqttTopicTitle = createElement('h4', 'Topic:');
  mqttTopicTitle.position(50, mqttServerTitle.size().height+mqttServerTitle.y+5);/**** */
  mqttTopicInput = createInput('');
  mqttTopicInput.position(mqttTopicTitle.size().width+mqttTopicTitle.x+10, mqttTopicTitle.size().height+mqttTopicTitle.y);
  mqttSaveButton = createButton('Save');
  mqttSaveButton.position(mqttTopicInput.x+mqttTopicInput.width, mqttTopicInput.y);
  mqttSaveButton.mousePressed(mqttKeySaveCommand);
  //***************************************
  mqttEnableHomeAssistantTitle = createElement('h4','Send Home Assistant:');
  mqttEnableHomeAssistantTitle.position(30, mqttTopicTitle.size().height+mqttTopicTitle.y+5);
  mqttEnableHomeAssistantCheckbox = createCheckbox('', false);
  mqttEnableHomeAssistantCheckbox.position(mqttEnableHomeAssistantTitle.size().width+mqttEnableHomeAssistantTitle.x+10, mqttEnableHomeAssistantTitle.size().height+mqttEnableHomeAssistantTitle.y);
  mqttEnableHomeAssistantSaveButton= createButton('Save');
  mqttEnableHomeAssistantSaveButton.position(mqttEnableHomeAssistantTitle.size().width+mqttEnableHomeAssistantTitle.x+40, mqttEnableHomeAssistantTitle.size().height+mqttEnableHomeAssistantTitle.y)
  mqttEnableHomeAssistantSaveButton.mousePressed(mqttEnableHomeAssistantSaveCommand)
  mqttHomeAssistantPrefixTitle = createElement('h4', 'HomeAssistant prefix topic:');
  mqttHomeAssistantPrefixTitle.position(50,mqttEnableHomeAssistantTitle.size().height+mqttEnableHomeAssistantTitle.y+5);
  mqttHomeAssistantPrefixInput = createInput('homeassistant');
  mqttHomeAssistantPrefixInput.position(mqttHomeAssistantPrefixTitle.size().width+mqttHomeAssistantPrefixTitle.x+10,mqttHomeAssistantPrefixTitle.size().height+mqttHomeAssistantPrefixTitle.y);
  mqttHomeAssistantPrefixSaveButton = createButton('Save');
  mqttHomeAssistantPrefixSaveButton.position(mqttHomeAssistantPrefixInput.x+mqttHomeAssistantPrefixInput.width,mqttHomeAssistantPrefixInput.y);
  mqttHomeAssistantPrefixSaveButton.mousePressed(mqttHomeAssistantPrefixSaveCommand);
  
  mqttHomeAssistantDiscoveryTitle = createElement('h4','Use Autodiscovery:');
  mqttHomeAssistantDiscoveryTitle.position(50, mqttHomeAssistantPrefixTitle.size().height+mqttHomeAssistantPrefixTitle.y+5);
  mqttHomeAssistantDiscoveryCheckbox = createCheckbox('', false);
  mqttHomeAssistantDiscoveryCheckbox.position(mqttHomeAssistantDiscoveryTitle.size().width+mqttHomeAssistantDiscoveryTitle.x+10, mqttHomeAssistantDiscoveryTitle.size().height+mqttHomeAssistantDiscoveryTitle.y);
  mqttHomeAssistantDiscoverySaveButton= createButton('Save');
  mqttHomeAssistantDiscoverySaveButton.position(mqttHomeAssistantDiscoveryTitle.size().width+mqttHomeAssistantDiscoveryTitle.x+40, mqttHomeAssistantDiscoveryTitle.size().height+mqttHomeAssistantDiscoveryTitle.y);
  mqttHomeAssistantDiscoverySaveButton.mousePressed(mqttHomeAssistantDiscoverySaveCommand)
  // mqttEnableHomeAssistantSaveButton.position(mqttEnableHomeAssistantTitle.size().width+mqttEnableHomeAssistantTitle.x+40, mqttEnableHomeAssistantTitle.size().height+mqttEnableHomeAssistantTitle.y)


  mqttHomeAssistantDiscoverySaveButton.mousePressed(mqttHomeAssistantDiscoverySaveCommand);

  //**************************************
  batteryOffsetTitle = createElement('h4', 'Battery Voltage  Calibration Offset:');
  batteryOffsetTitle.position(10, mqttHomeAssistantDiscoveryTitle.size().height+mqttHomeAssistantDiscoveryTitle.y+5);
  batteryOffsetInput = createInput('');
  batteryOffsetInput.size(40);
  batteryOffsetInput.position(batteryOffsetTitle.size().width+batteryOffsetTitle.x+10, batteryOffsetTitle.size().height+batteryOffsetTitle.y);  
  batteryOffsetButton = createButton('Save');
  batteryOffsetButton.position(batteryOffsetInput.x+batteryOffsetInput.width, batteryOffsetInput.y);
  batteryOffsetButton.mousePressed(batteryOffsetCommand);
  //**************************************

  createCanvas(600, batteryOffsetInput.y+100);


  hideAllParam();
}


function draw() {
  drawScreen();
}
