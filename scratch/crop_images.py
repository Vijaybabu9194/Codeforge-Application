import os
from PIL import Image

def main():
    collage_path = '/Users/avijaybabu/.gemini/antigravity-ide/brain/9ffdcbdf-b197-4ecf-a509-579ea87ebdc2/media__1781797567531.jpg'
    img = Image.open(collage_path)
    # x start at 349
    rocket_box = (349, 608, 380, 642)
    rocket_img = img.crop(rocket_box)
    rocket_img.save('/Users/avijaybabu/Desktop/CodeForge-1/frontend/src/assets/rocket.png')
    print("Recropped rocket.png successfully")

if __name__ == '__main__':
    main()
