#define BLYNK_TEMPLATE_ID "TMPL6zM_ehjaG"
#define BLYNK_TEMPLATE_NAME "ProjectIOT"
#define BLYNK_AUTH_TOKEN "5Idv4Aa5O5XyVBoIrMkpqnUlcvb_iS7K"
#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>
#include "DHT.h"

#define ledH1 12
#define ledH2 26
#define ledL 13
#define ldr 32
#define DHTPIN 25
#define soil 33
#define relay 14

#define DHTTYPE DHT22 
DHT dht(DHTPIN, DHTTYPE);

int check = 0,button,value,ref1,ref2;
int Val_soil,Val_photo;
int phantram_soil, phantram_photo;
int buttonL, buttonT, buttonW;

// Thiet bi hien thi tren Blynk
//WidgetLED appledL(V7);
WidgetLED NhietDo(V8);	//NhietDo
WidgetLCD DoAm(V9);	//DoAm
WidgetLCD DoAmDat(V10);	//DoAmDat


char auth[] = BLYNK_AUTH_TOKEN;
char ssid[] = "Ahtung";
char pass[] = "12345678";

void setup() {
  Serial.begin(115200);
  Blynk.begin(auth, ssid, pass);
  pinMode(ledH1, OUTPUT);
  pinMode(ledH2, OUTPUT);
  pinMode(ledL, OUTPUT);
  pinMode(relay, OUTPUT);
  dht.begin();
  Blynk.syncVirtual(V2);
  Blynk.syncVirtual(V3);
  Blynk.syncVirtual(V4);
  Blynk.syncVirtual(V5);
  Blynk.syncVirtual(V1);
  Blynk.syncVirtual(V6);
  Blynk.syncVirtual(V7);
}
BLYNK_WRITE(V2){ // Dieu chinh che do Manual or Auto
  check = param.asInt();
}
BLYNK_WRITE(V3){ //Lay gia tri nhiet do moc
  value = param.asInt();
}
BLYNK_WRITE(V4){ //Lay gia tri do am MAX
  ref1 = param.asInt();
}
BLYNK_WRITE(V5){ //Lay gia tri do am MIN
  ref2 = param.asInt();
}
BLYNK_WRITE(V1){ // Bat Led sang thu cong
   buttonL = param.asInt();
}
BLYNK_WRITE(V6){ // Bat den suoi thu cong
   buttonT = param.asInt();
}
BLYNK_WRITE(V7){ // Bat may bom thu cong
   buttonW = param.asInt();
}
void loop() {
  Blynk.run();

  // Tinh gia tri phan tram do am dat
  Val_soil = analogRead(soil); // 0 --> 1023
  phantram_soil = map(Val_soil, 0, 1023, 100, 0); // chuyen sang phantram

  Blynk.virtualWrite(V8,String(dht.readTemperature()));
  Blynk.virtualWrite(V9,String(dht.readHumidity()));
  Blynk.virtualWrite(V10,String(phantram_soil));
  
  // Tinh gia tri anh sang
  Val_photo = analogRead(ldr);
  Serial.println(Val_photo);

  // Che do Auto
  if(check == 1){
 
    // Bat may bom nuoc
    if (phantram_soil > ref1){

      // digitalWrite(ledy,HIGH);
      digitalWrite(relay,LOW);
      Serial.println("Tat may bom");
      // Blynk.notify("Độ ẩm cao");
      // Blynk.virtualWrite(V9,"Độ ẩm cao"); //hiển thị trên LCD dòng 1
    }
    else if (phantram_soil < ref2){

      digitalWrite(relay,HIGH);
      Serial.println("Bat may bom");
      // Blynk.notify("Độ ẩm thấp");
      // Blynk.virtualWrite(V9,"Đang tưới nước");
    }
    else {

      digitalWrite(relay,LOW);
      // Blynk.virtualWrite(V9,"Độ ẩm BT");
      Serial.println("Tat may bom");
    }

    // Bat den chieu sang
    if( Val_photo >= 300 && digitalRead(ledH1) == LOW){
      digitalWrite(ledL, HIGH);
    }
    else{
      digitalWrite(ledL, LOW);
    }

    // Bat den suoi
    if(dht.readTemperature() < value){
      digitalWrite(ledH1,HIGH);
      digitalWrite(ledH2,HIGH);
    }
    else{
      digitalWrite(ledH1,LOW);
      digitalWrite(ledH2,LOW);
    }
  }

  // Che do Manual
  else{ 

    // Bat may bom nuoc
    if (buttonW == 1){
      digitalWrite(relay,HIGH);
    }
    else {
      digitalWrite(relay,LOW);
    }

    // Bat den chieu sang
    if(buttonL == 1 && buttonT == 0){
      digitalWrite(ledL, HIGH);
    }
    else{
      digitalWrite(ledL, LOW);
    }

    // Bat den suoi
    if(buttonT == 1){
      digitalWrite(ledH1, HIGH);
      digitalWrite(ledH2, HIGH);
    }
    else{
      digitalWrite(ledH1, LOW);
      digitalWrite(ledH2, LOW);
    }
  } 
  delay(2000);
}