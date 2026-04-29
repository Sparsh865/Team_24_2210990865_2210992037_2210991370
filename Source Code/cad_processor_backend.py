"""
PROJECT: Digital Twin CAD-to-3D Converter
MODULE: CAD Data Ingestion & Transformation (Enhanced for STEP/Color)
DESCRIPTION: Converts STEP/STL geometry into colorful, web-optimized 3D formats.
"""

import trimesh
import os

# Note: Run 'pip install trimesh[easy] cascadio' for this to work with STEP files.

class CADConverter:
    def __init__(self, input_file):
        self.input_file = input_file
        self.geometry = None

    def process_geometry(self):
        print(f"Ingesting file: {self.input_file}")
        
        # Load the CAD file. 
        # For .step files, trimesh uses cascadio to preserve colors and hierarchy.
        self.geometry = trimesh.load(self.input_file)

        # Optimization Logic
        if isinstance(self.geometry, trimesh.Scene):
            print(f"Detected Assembly with {len(self.geometry.geometry)} parts.")
            # We iterate through parts to simplify them individually while keeping colors
            for name, mesh in self.geometry.geometry.items():
                if hasattr(mesh, 'simplify_quadric_decimation'):
                    # Simplify each part by 50% to keep web performance high
                    self.geometry.geometry[name] = mesh.simplify_quadric_decimation(0.5)
        else:
            # Single mesh simplification (STL/OBJ)
            self.geometry = self.geometry.simplify_quadric_decimation(0.5)

    def export_to_web(self, output_path):
        # include_normals=True ensures proper lighting/shading in Three.js
        # For scenes (STEP), this preserves the material colors assigned in CAD
        self.geometry.export(output_path, file_type='glb', include_normals=True)
        print(f"Success: Converted {self.input_file} to {output_path}")

if __name__ == "__main__":
    # IMPORTANT: To get colors, use a .step or .stp file here instead of .STL
    # Ensure your CAD software exported it as STEP AP214 or AP242.
    input_filename = "SteamEngineReverseGearAsm.stp" 
    
    if os.path.exists(input_filename):
        converter = CADConverter(input_filename)
        converter.process_geometry()
        converter.export_to_web("new_base_twin.glb")
    else:
        print(f"File {input_filename} not found. Please check the path.")