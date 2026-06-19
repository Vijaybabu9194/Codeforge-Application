import cv2
import numpy as np
from collections import Counter

def get_accent_colors(image_path, num_colors=10):
    img = cv2.imread(image_path)
    # Resize to speed up
    img = cv2.resize(img, (400, 300), interpolation=cv2.INTER_AREA)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Reshape to 1D array of pixels
    pixels_bgr = img.reshape(-1, 3)
    pixels_hsv = hsv.reshape(-1, 3)
    
    # Filter for high saturation (S > 120, V > 120) to find accents
    accent_pixels = []
    for bgr, h in zip(pixels_bgr, pixels_hsv):
        s = h[1]
        v = h[2]
        if s > 120 and v > 120:
            accent_pixels.append('#{:02x}{:02x}{:02x}'.format(bgr[2], bgr[1], bgr[0])) # BGR to RGB hex
            
    counter = Counter(accent_pixels)
    print("Accent colors found in the image:")
    for color, count in counter.most_common(num_colors):
        print(f"Color: {color}, Count: {count}")

if __name__ == '__main__':
    get_accent_colors('/Users/avijaybabu/.gemini/antigravity-ide/brain/9ffdcbdf-b197-4ecf-a509-579ea87ebdc2/media__1781794250669.jpg')
