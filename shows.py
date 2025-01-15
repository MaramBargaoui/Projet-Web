import os
import pandas as pd

# Ensure this is the correct path where Shows.csv is located
shows_df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'Shows.csv'))
