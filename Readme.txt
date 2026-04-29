Team Members
Sparsh Mittal - 2210990865                                                                                                                             
Payal - 2210992037
Arshpreet Singh - 2210991370

Software & Platform Used
Operating System: Windows / macOS / Linux

IDE/Editor: Visual Studio Code (VS Code)

Browser: Google Chrome / Microsoft Edge (WebGL 2.0 compatible)

Local Server: VS Code "Live Server" Extension or Python http.server

Programming Languages & Frameworks
Backend/Processing: Python 3.9+

Frontend: JavaScript (ES6+), HTML5, CSS3

3D Library: Three.js (WebGL Engine)

Required Libraries & Tools
Before running the project, install the following dependencies via terminal:

Python Libraries:

Bash
pip install trimesh[easy] cascadio scipy
trimesh: For 3D mesh manipulation and GLB export.

cascadio: To handle STEP file mathematics and color data.

scipy: Required for the quadric decimation (mesh simplification) logic.

VS Code Extension:

Install "Live Server" by Ritwick Dey from the VS Code Marketplace.

Steps to Run the Code
Step 1: Convert the CAD Geometry
Place your source CAD file (e.g., StageLight_11_step.step) in the project root folder.

Open CADConverter.py and ensure the input_filename matches your file.

Run the script:

Bash
python CADConverter.py
Verify that new_base_twin.glb has been generated in your folder.

Step 2: Launch the Digital Twin Dashboard
Open the project folder in Visual Studio Code.

Right-click on index.html and select "Open with Live Server".

Alternatively, click the "Go Live" button in the bottom-right status bar.

Your browser will open to http://127.0.0.1:5500.

Username & Password
Not Required. This version of the Digital Twin is an open-access industrial viewer.

Input and Expected Output
Input: * A raw CAD file (.step for color support or .stl for geometry).

User interactions via the dashboard UI (Buttons for Zoom/Rotation).

Expected Output:

Automated Scaling: The model automatically fills 90% of the viewport upon loading.

Interactive Motion: Smooth Y-axis rotation that can be toggled via the "STOP/PLAY MOTION" button.

Precision Zoom: Incremental + and - buttons that adjust the camera focus.

Pick and Place: Clicking the model reveals a Transform Gizmo allowing the user to reposition the asset in 3D space.

Visual Fidelity: A multi-colored, metallic-finish representation of the CAD geometry.

Project Architecture Note
This project utilizes a Zero-Latency Rendering approach by pre-processing heavy CAD math in Python and utilizing the GPU for real-time visualization via WebGL, ensuring smooth performance even on standard laptops.