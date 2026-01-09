# utils/name_generator.py
import random
import os

# Data path points up one level (from utils/) then into the data/ folder
DATA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')

class NameGenerator:
    def __init__(self, first_names_file='first_names.txt', last_names_file='last_names.txt'):
        self.first_names = self._load_names(first_names_file)
        self.last_names = self._load_names(last_names_file)

    def _load_names(self, filename):
        file_path = os.path.join(DATA_PATH, filename)
        try:
            with open(file_path, 'r') as f:
                names = [line.strip() for line in f if line.strip()]
            return names
        except FileNotFoundError:
            print(f"Error: Name file not found at {file_path}")
            return []
        except Exception as e:
            print(f"An error occurred while reading {filename}: {e}")
            return []

    def generate_name(self):
        if not self.first_names or not self.last_names:
            return "Name Error"
            
        first = random.choice(self.first_names)
        last = random.choice(self.last_names)
        return f"{first} {last}"