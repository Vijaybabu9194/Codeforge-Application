import cv2
import numpy as np
from collections import Counter

def get_dominant_colors(image_path, num_colors=15):
    img = cv2.imread(image_path)
    # Resize to speed up
    img = cv2.resize(img, (200, 150), interpolation=cv2.INTER_AREA)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Flatten pixels
    pixels = img.reshape(-1, 3)
    
    # Simple count
    hex_colors = []
    for pixel in pixels:
        hex_colors.append('#{:02x}{:02x}{:02x}'.format(pixel[0], pixel[1], pixel[2]))
        
    counter = Counter(hex_colors)
    print("Top colors in the image:")
    for color, count in counter.most_common(num_colors):
        print(f"Color: {color}, Percentage: {count / len(pixels) * 100:.2f}%")

if __name__ == '__main__':
    get_dominant_colors('/Users/avijaybabu/.gemini/antigravity-ide/brain/9ffdcbdf-b197-4ecf-a509-579ea87ebdc2/media__1781794250669.jpg')
