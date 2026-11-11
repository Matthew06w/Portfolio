/* =========================================================
   PROJECT DATA (shared by index.html and space.html) — edit this list to add / change projects.
   To add a new project: copy one { ... } block, fill it in,
   and remove `placeholder: true` from the template entry.
   tags must use the names in FILTERS below.
   ========================================================= */
var FILTERS = ['AI / CV', 'Hardware', 'Software', 'Research'];

var PROJECTS = [
  {
    id: 'edubin',
    date: '2026-03', // YYYY-MM, used to sort the grid newest first
    featured: true,
    title: 'EDUBin',
    subtitle: 'AI-Powered Recycling Educational Tool',
    type: 'Group project · Oct 2025 – Mar 2026',
    tags: ['AI / CV', 'Hardware'],
    images: [
      { src: 'images/edu1.jpg', label: 'Poster' },
      { youtube: '2pwycMwPZ4w', label: 'Video' },
      { src: 'images/edu3.png', label: 'Computer Vision' }
    ],
    pipeline: ['Camera', 'MobileNetV2', 'Rotate + tilt sort', 'Voice / LED feedback'],
    desc: [
      'A smart recycling bin for primary school classrooms. A camera classifies each item\'s material with computer vision, and a rotating–tilting mechanism sorts it into the correct compartment.',
      'The bin teaches students at the point of disposal, giving real-time feedback through voice prompts, an on-screen display and LED cues to reduce contamination and build correct recycling habits.'
    ],
    specs: [
      ['Project type', 'Group project'],
      ['Goal', 'Accurate recycling and recycling education in primary schools'],
      ['My role', 'Software, electronics, data collection, model training and CAD'],
      ['Software', 'Python, TensorFlow, CAD'],
      ['Techniques', 'Image classification with MobileNetV2, rotating–tilting sorting mechanism, voice/display/LED feedback']
    ]
  },
  {
    id: 'lazergraft',
    date: '2026-07',
    title: 'LazerGraft',
    subtitle: 'Mid-air drawing with just a webcam',
    type: 'Personal project · Jul 2026',
    tags: ['AI / CV'],
    images: [
      { src: 'images/CV.gif', label: 'Live demo' },
      { src: 'images/lazergraft-1.jpg', label: 'How it works' }
    ],
    desc: [
      'A real-time computer vision tool that turns a webcam into a mid-air drawing surface, replicating the "light board" effect used by online educators, with no touchscreen or tablet required.',
      'Hand-landmark tracking is handled with MediaPipe, and strokes are rendered live with OpenCV as the hand moves through the frame, translating fingertip position directly into on-screen ink.'
    ],
    specs: [
      ['Project type', 'Individual project'],
      ['Goal', 'Turn a webcam into a mid-air drawing surface'],
      ['My role', 'Hand tracking, stroke rendering and real-time interaction'],
      ['Software', 'MediaPipe, OpenCV, Python'],
      ['Techniques', 'Hand landmark tracking, fingertip position mapping']
    ],
    link: { href: 'https://github.com/Matthew06w/LazerGraph', text: 'View the code on GitHub' }
  },
  {
    id: 'daycharge',
    date: '2026-08',
    title: 'DayCharge',
    subtitle: 'Solar-cell bicycle light',
    type: 'Group project · Aug 2026',
    tags: ['Hardware'],
    images: [
      { src: 'images/Bicycle%20Light%201.png', label: 'Prototype' },
      { src: 'images/Bicycle%20Light%202.png', label: 'Electronics' },
      { src: 'images/daycharge-2.jpg', label: 'Circuit' },
      { src: 'images/daycharge-1.jpg', label: 'On the road' }
    ],
    desc: [
      'A bicycle light rebuilt around a salvaged LED circuit board into a self-charging solar power system. I integrated a solar panel and a TP4056 charging module into the salvaged electronics so the light tops itself up continuously during the day.',
      'Everything lives inside a custom enclosure I designed and 3D-modeled in Onshape, precision-fit to the solar panel and engineered for secure handlebar mounting.'
    ],
    specs: [
      ['Project type', 'Group project'],
      ['Goal', 'Self-charging bicycle light powered by a solar panel'],
      ['My role', 'Electronics integration and enclosure design'],
      ['Software', 'Onshape (CAD)'],
      ['Techniques', '3D modelling, solar panel integration']
    ]
  },
  {
    id: 'sign-language',
    date: '2025-01',
    title: 'Sign Language Translator',
    subtitle: 'Real-time gesture-to-Thai translation with LSTM',
    type: 'Research Intern, KMUTT · 2024–2025',
    tags: ['AI / CV', 'Research'],
    images: [
      { src: 'images/LSTM.gif', label: 'Live demo' },
      { embed: 'pdf/LSTM-Based%20Sign%20Language%20Recognition%20Presentation.pdf#view=FitH', label: 'Slides (PDF)' }
    ],
    link: { href: 'pdf/LSTM-Based%20Sign%20Language%20Recognition%20Presentation.pdf', text: 'Open the presentation (PDF)' },
    desc: [
      'A real-time system that translates hand gestures into text and spoken Thai. I collected my own gesture data, extracted hand landmarks with MediaPipe, and trained an LSTM network to recognise three gestures from their movement over time.',
      'The model runs inside a web application that shows the recognised gesture on screen and speaks it aloud in Thai.'
    ],
    specs: [
      ['Project type', 'Individual project'],
      ['Goal', 'Real-time translation of hand gestures'],
      ['My role', 'Data collection, model training and web app development'],
      ['Software', 'Python, MediaPipe, TensorFlow'],
      ['Techniques', 'Hand landmark extraction, sequence modelling with LSTM, Thai text-to-speech']
    ]
  },
  {
    id: 'mri-dementia',
    date: '2025-01',
    title: 'MRI Dementia Classification',
    subtitle: 'Custom CNN vs. VGG16 on brain MRI scans',
    type: 'Research Intern, KMUTT · 2024–2025',
    tags: ['AI / CV', 'Research'],
    images: [
      { src: 'images/BCC.png', label: 'Summary' },
      { src: 'images/BCC2.png', label: 'More' },
      { embed: 'https://www.canva.com/design/DAGUwOMTLv0/kUFyMlSo898Z0EUV8bwBTQ/view?embed', label: 'Slides' }
    ],
    desc: [
      'A comparison of a custom CNN and a VGG16 transfer-learning model for classifying dementia stages from brain MRI scans. VGG16 outperformed on the test set, especially on the Very Mild Demented class.',
      'VGG16 also held up better on an independent dataset, and Grad-CAM showed the models focusing on clinically relevant brain regions.'
    ],
    link: {
      href: 'https://medium.com/@matthew.hem_g32/mri-based-classification-of-dementia-stages-by-using-deep-convolutional-networks-bdd722c58782',
      text: 'Read the full write-up (Thai) on Medium'
    },
    specs: [
      ['Project type', 'Research study'],
      ['Goal', 'Compare a custom CNN and VGG16 for dementia stage classification'],
      ['My role', 'Model development and evaluation'],
      ['Software', 'Python, TensorFlow/Keras'],
      ['Techniques', 'CNNs, transfer learning, Grad-CAM, stratified 70/15/15 split']
    ]
  },
  {
    id: 'ion-detector',
    date: '2024-03',
    title: 'Low-Cost Ion Detector',
    subtitle: '2-in-1 apparatus for nitrate & phosphate detection in soil and water',
    type: 'Group project · March 2024',
    tags: ['Hardware', 'Research'],
    badge: '2× Gold',
    // { youtube: '<video id>' } shows a YouTube video; it is listed first so it opens first
    images: [
      { youtube: '5xWKFr7n5CI', label: 'Video' },
      { src: 'images/agrisense1.jpg', label: 'Device' },
      { src: 'images/agrisense2.jpg', label: 'More' }
    ],
    desc: [
      'A portable device that measures nitrate and phosphate in soil and water using a colour-based (colorimetric) method. Normal test kits and lab tests are expensive, slow and manual; our device runs the test automatically and gives a result in about 2 minutes instead of about 2 days in a lab.',
      'The device adds reagents to the sample, which changes colour (yellow for nitrate, blue for phosphate). An LED shines through the sample onto an RGB sensor, and the change in light is converted into an absorbance value, then a concentration, shown on a small screen.',
      'I ran the colorimetric method in the lab to collect nitrate and phosphate data, built the calibration curves linking sensor readings to concentration (R² ≈ 0.99 against a spectrophotometer), and worked on the prototypes, from a first version with syringe problems, through a second that was too big, to the latest one.'
    ],
    results: [
      ['~95%', 'accuracy vs. spectrophotometer'],
      ['~2 min', 'per test, vs. ~2 days in a lab'],
      ['31%', 'lower lifetime cost (US$17.22)']
    ],
    awards: [
      'Gold Award, IDEX 2024, Singapore',
      'Gold Medal, World Invention Competition and Exhibition (WICE) 2024, Malaysia',
      'Accepted for publication in the Journal of Food Agricultural Sciences and Technology (FAST)'
    ],
    link: {
      href: 'https://youtu.be/5xWKFr7n5CI',
      text: 'Watch the video on YouTube'
    },
    specs: [
      ['Project type', 'Group project'],
      ['Goal', 'Fast, low-cost nitrate and phosphate testing for agriculture and the environment'],
      ['My role', 'Lab data collection, regression / calibration curves and prototyping'],
      ['Techniques', 'Colorimetry, LED + RGB sensor absorbance measurement, calibration curves, automated reagent dosing']
    ]
  },
  {
    id: 'verdian-02',
    date: '2024-09',
    title: 'VERDIAN-02',
    subtitle: 'Vegetation Remote Detection and Integrated Agricultural Navigation',
    type: 'Group project · Sep 2024',
    tags: ['Hardware'],
    badge: 'Winner',
    images: [
      { src: 'images/vd1.png', label: 'Photo 1' },
      { src: 'images/vd2.png', label: 'Photo 2' },
      { src: 'images/vd3.png', label: 'Photo 3' },
      { src: 'images/vd4.png', label: 'Photo 4' },
      { src: 'images/vd5.png', label: 'Photo 5' },
      { embed: 'https://www.canva.com/design/DAGdoitsXr4/win51pYGwE_PpIDshC8FaQ/view?embed', label: 'Slides' }
    ],
    desc: [
      'A CubeSat concept designed to monitor crops and environmental conditions remotely from orbit.',
      'Our team entered the School Satellite competition and won, earning the chance to build a CubeSat with GISTDA (Thailand\'s space agency) over two weeks in a clean room.'
    ],
    specs: [
      ['Project type', 'Group project, competition'],
      ['Goal', 'Remote monitoring of crops and environmental conditions with a CubeSat'],
      ['My role', 'CubeSat design, pitching and presentation'],
      ['Result', 'Won the competition; built a CubeSat with GISTDA in a clean room (2 weeks)']
    ],
    link: { href: 'https://www.canva.com/design/DAGdoitsXr4/win51pYGwE_PpIDshC8FaQ/view', text: 'Open slides in Canva' }
  },
  {
    id: 'visioncap',
    date: '2023-01',
    title: 'VisionCap',
    subtitle: 'Artificial vision for visually impaired people',
    type: 'Project · 2023',
    tags: ['Hardware'],
    images: [
      { src: 'images/vc1.jpg', label: 'Photo 1' },
      { src: 'images/vc2.jpg', label: 'Photo 2' },
      { src: 'images/vc3.jpg', label: 'Photo 3' }
    ],
    pipeline: ['Ultrasonic sensors', 'Microcontroller', 'Buzzer alert'],
    desc: [
      'A wearable cap that helps visually impaired people sense what is around them. Ultrasonic sensors on the cap measure the distance to nearby objects, and a buzzer warns the wearer when something is close.'
    ],
    specs: [
      ['Goal', 'Help visually impaired people detect surrounding obstacles'],
      ['My role', 'Prototyping and electronics'],
      ['Techniques', 'Ultrasonic distance sensing, buzzer feedback']
    ]
  },
  {
    id: 'bemyeducation',
    date: '2023-01',
    title: 'BEMYEDUCATION',
    subtitle: 'Education for all students',
    type: 'Hackathon project · 2023',
    tags: ['Software'],
    badge: 'Winner',
    images: [
      { src: 'images/bme0.jpg', label: 'Photo 1' },
      { youtube: 'mSWNHPNXyis', label: 'Video' },
      { src: 'images/bme1.jpg', label: 'Photo 2' }
    ],
    desc: [
      'A website built during the School Hackathon for students and teachers who need more study time. It helps them find learning resources by subject and grade level.',
      'A reward system recognises students who stay dedicated to their studies. The project won the School Hackathon 2023.'
    ],
    awards: ['Winner, School Hackathon 2023'],
    specs: [
      ['Project type', 'Hackathon project'],
      ['Result', 'Won the School Hackathon 2023'],
      ['Goal', 'Make study resources easy to find for every student'],
      ['Features', 'Resource search by subject and grade, student reward system']
    ]
  },
  {
    id: 'pressure-injury',
    date: '2026-08',
    title: 'Robotic Repositioning System',
    subtitle: 'For pressure-injury prevention',
    type: 'Group project · Aug 2026',
    tags: ['Hardware'],
    // { embed: '<url>' } shows any embeddable page (here, Canva slides)
    images: [
      { src: 'images/Dgis1.png', label: 'Photo 1' },
      { src: 'images/Dgis2.png', label: 'Photo 2' },
      { src: 'images/Dgis3.png', label: 'Photo 3' },
      { embed: 'https://www.canva.com/design/DAHTQviyh8I/zbzo2sDvzLsDDtQVrHEeyQ/view?embed', label: 'Slides' }
    ],
    desc: [
      'A robotic system that repositions patients to help prevent pressure injuries.',
      'Proposed to Chongqing University during the DGIS 2026 exchange programme.'
    ],
    specs: [
      ['Project type', 'Group project, DGIS 2026 proposal'],
      ['Goal', 'Prevent pressure injuries by repositioning patients automatically'],
      ['Presented at', 'Chongqing University, China']
    ],
    link: { href: 'https://www.canva.com/design/DAHTQviyh8I/zbzo2sDvzLsDDtQVrHEeyQ/view', text: 'Open slides in Canva' }
  },
  {
    id: 'cp-contest',
    date: '2026-07',
    title: 'SUTD Competitive Programming Contest',
    subtitle: '1st place out of 70+ teams',
    type: 'Team of 2 · 4 Jul 2026',
    tags: ['Software'],
    badge: '1st Place',
    images: [
      { src: 'images/cp-1.jpg', label: 'Winners' },
      { src: 'images/cp-2.jpg', label: 'Gold Award' },
      { src: 'images/cp-3.jpg', label: 'Best Freshmore Team' },
      { src: 'images/cp-4.jpg', label: 'First to solve A, B & F' },
      { src: 'images/cp-5.jpg', label: 'Final scoreboard' },
      { src: 'images/cp-6.jpg', label: 'All contestants' }
    ],
    results: [['1st', 'of 70+ teams'], ['9 / 10', 'problems solved'], ['3', 'problems solved first']],
    awards: ['Gold Award, contest winner', 'Best Freshmore Team', 'First to solve problems A, B & F'],
    desc: [
      'A timed algorithm contest at SUTD. My teammate and I competed as team CK FASTCODE.',
      'We solved 9 of the 10 problems, were the first team to crack 3 of them, and took 1st place out of more than 70 teams.'
    ],
    specs: [
      ['Project type', 'Competition, team of 2 (CK FASTCODE)'],
      ['Result', '1st place, 9/10 solved, 3 first solves']
    ]
  },
  {
    id: 'choosi',
    date: '2025-09',
    title: 'Choosi',
    subtitle: 'AI app that helps you choose based on your own values',
    type: 'Group project · Sep 2025',
    tags: ['Software'],
    images: [
      { src: 'images/choosi-1.jpg', label: 'Hackathon pitch' },
      { embed: 'https://www.canva.com/design/DAGzzh6lwzY/XyNNFYvvtIBH3dvoZP8X4g/view?embed', label: 'Slides' }
    ],
    link: { href: 'https://www.canva.com/design/DAGzzh6lwzY/XyNNFYvvtIBH3dvoZP8X4g/view', text: 'Open slides in Canva' },
    desc: [
      'An AI-powered decision-making app that helps people make everyday choices based on their own values and priorities. Built at the SEVEN MVP Hackathon.',
      'We didn\'t win a prize, but it was my first university project and great hands-on practice in building an app as a team.'
    ],
    specs: [
      ['Project type', 'Group project, SEVEN MVP Hackathon'],
      ['Goal', 'Help users make everyday choices based on their personal values'],
      ['My role', 'UI design and coding']
    ]
  },
  {
    id: 'algal-carbon-capture',
    date: '2024-06',
    title: 'Algal Carbon Capture',
    subtitle: 'Bio-based solution to tackling climate change',
    type: 'Team of 3 · 5–7 Jun 2024',
    tags: ['Hardware'],
    badge: 'Winner',
    images: [
      { src: 'images/ACC1.png', label: 'Title slide' },
      { src: 'images/ACC2.png', label: 'Model components' },
      { src: 'images/ACC4.png', label: 'Pitching' },
      { src: 'images/ACC3.png', label: 'Winners' },
      { embed: 'pdf/ACC%20SLIDE.pdf#view=FitH', label: 'Slides (PDF)' }
    ],
    desc: [
      'A device that cultivates algae to capture carbon dioxide. One unit can absorb about 16 kg of CO₂, roughly as much as a large, healthy tree.',
      'The 350 mm tall unit uses a 5 V pump and an airstone to bubble air through the algae, an LED light and photoresistor to manage light, and a servo-controlled valve, all run by an STM32 microcontroller.',
      'We pitched the idea at the ThEP Hackathon Season 2, held during the 19th Siam Physics Congress (SPC 2024), and won.'
    ],
    awards: ['Winner, ThEP Hackathon Season 2 (20,000 Baht prize)'],
    specs: [
      ['Project type', 'Hackathon, team of 3'],
      ['Event', 'ThEP Hackathon Season 2, 19th Siam Physics Congress (SPC 2024)'],
      ['Organizer', 'Thailand Center of Excellence in Physics (ThEP)'],
      ['Goal', 'Capture CO₂ by cultivating algae'],
      ['Hardware', 'STM32, 5 V pump, airstone, LED light, photoresistor, servo valve']
    ],
    link: { href: 'pdf/ACC%20SLIDE.pdf', text: 'Open the presentation (PDF)' }
  },
  {
    // TEMPLATE — fill this in for your next project, then delete `placeholder: true`
    id: 'project-7',
    date: '[YYYY-MM]',
    placeholder: true,
    title: '[Project Title]',
    subtitle: '[Short subtitle]',
    type: '[Personal / Group project · Year]',
    tags: [],
    images: [{ src: 'images/project-7.png', label: 'Main' }],
    desc: ['[What the project is and what it does.]', '[How it works or what the result was.]'],
    specs: [
      ['Project type', '[Individual / Group project]'],
      ['Goal', '[What the project set out to achieve]'],
      ['My role', '[What you were responsible for]'],
      ['Software', '[Tools and languages used]'],
      ['Techniques', '[Key methods or techniques]']
    ]
  }
];
