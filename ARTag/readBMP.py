import os
from scipy import misc
path = 'your_file_path'
image= misc.imread(os.path.join(path,'image.bmp'), flatten= 0)
