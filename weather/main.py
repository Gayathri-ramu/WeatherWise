import time
from tkinter import *
from tkinter import messagebox as mb
import requests
from plyer import notification

# Creating the window
wn = Tk()
wn.title("Weather Alert System")
wn.geometry('800x500')
wn.config(bg='#E8F1F5')  

# Styling constants
PRIMARY_COLOR = "#1B4965"  
SECONDARY_COLOR = "#5FA8D3"  
BG_COLOR = "#E8F1F5"  
FONT_TITLE = ("Helvetica", 24, "bold")
FONT_LABEL = ("Helvetica", 14)
FONT_BUTTON = ("Helvetica", 12, "bold")

# Create main frame
main_frame = Frame(wn, bg=BG_COLOR, padx=40, pady=40)
main_frame.place(relx=0.5, rely=0.5, anchor=CENTER)

# Heading label with modern styling
title_label = Label(
    main_frame,
    text="Weather Alert System",
    font=FONT_TITLE,
    fg=PRIMARY_COLOR,
    bg=BG_COLOR,
    pady=20
)
title_label.pack()

# Input frame
input_frame = Frame(main_frame, bg=BG_COLOR, pady=30)
input_frame.pack()

# Location label and entry
Label(
    input_frame,
    text='Enter Location:',
    font=FONT_LABEL,
    bg=BG_COLOR,
    fg=PRIMARY_COLOR
).pack(side=LEFT, padx=10)

place = StringVar(wn)
place_entry = Entry(
    input_frame,
    width=30,
    textvariable=place,
    font=FONT_LABEL,
    relief="solid",
    bd=1
)
place_entry.pack(side=LEFT, padx=10)

def getNotification():
    cityName = place.get()
    baseUrl = "http://api.openweathermap.org/data/2.5/weather"
    try:
        url = baseUrl + "?q=" + cityName + "&appid=d850f7f52bf19300a9eb4b0aa6b80f0d"
        response = requests.get(url)
        x = response.json()
        y = x["main"]
        
        temp = y["temp"] - 273
        pres = y["pressure"]
        hum = y["humidity"]
        z = x["weather"]
        weather_desc = z[0]["description"]

        info = f"""Weather in {cityName}:
Temperature: {temp:.1f}°C
Pressure: {pres} hPa
Humidity: {hum}%
Conditions: {weather_desc.title()}"""

        notification.notify(
            title="WEATHER REPORT",
            message=info,
            timeout=2
        )
        time.sleep(7)
    
    except Exception as e:
        mb.showerror('Error', 'Could not fetch weather data. Please check the city name and try again.')

# Button frame
button_frame = Frame(main_frame, bg=BG_COLOR, pady=20)
button_frame.pack()

# Styled button
notify_btn = Button(
    button_frame,
    text='Get Weather Report',
    font=FONT_BUTTON,
    fg='white',
    bg=SECONDARY_COLOR,
    padx=20,
    pady=10,
    relief="flat",
    command=getNotification,
    cursor="hand2"
)
notify_btn.pack()

# Add hover effect
def on_enter(e):
    notify_btn['bg'] = PRIMARY_COLOR

def on_leave(e):
    notify_btn['bg'] = SECONDARY_COLOR

notify_btn.bind("<Enter>", on_enter)
notify_btn.bind("<Leave>", on_leave)

wn.mainloop()