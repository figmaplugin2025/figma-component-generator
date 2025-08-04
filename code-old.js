// Figma Plugin Code
figma.showUI(__html__, { width: 420, height: 650 });

// Component configuration
const componentConfig = {
  key: "21dec29ff1244eedd26d01652d7788c23b0867d0",
  name: "Component #1"
};

// Element type configurations
const elementConfigs = {
  "component-1": {
    name: "Component #1",
    credits: 10
  },
  "small-graph": {
    text: "Revenue",
    value: "$12,450",
    width: 160,
    height: 80,
    color: { r: 0.2, g: 0.6, b: 0.9 }
  },
  "ui-component": {
    componentKey: "11:189",
    width: 120,
    height: 80
  },
  "green-cube": {
    width: 80,
    height: 80,
    color: { r: 0.2, g: 0.8, b: 0.4 }
  }
};

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-component-1') {
    try {
      // Import the component from the published library using the component key
      const component = await figma.importComponentByKeyAsync(componentConfig.key);
      
      if (component) {
        // Create an instance of the component
        const instance = component.createInstance();
        
        // Position the component at the center of the viewport
        instance.x = figma.viewport.center.x - instance.width / 2;
        instance.y = figma.viewport.center.y - instance.height / 2;
        
        // Add to the current page
        figma.currentPage.appendChild(instance);
        
        // Select the created instance
        figma.currentPage.selection = [instance];
        
        // Scroll to the created component
        figma.viewport.scrollAndZoomIntoView([instance]);
        
        figma.notify(`Created ${componentConfig.name}!`);
      } else {
        figma.notify('Could not import component. Please check if the component is published.');
      }
    } catch (error) {
      console.error('Error importing component:', error);
      figma.notify('Error importing component. Please check the component key.');
    }
  }
  
  if (msg.type === 'create-input') {
    await createElement(msg.inputType);
  }
  
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

async function createElement(elementType) {
  const config = elementConfigs[elementType];
  if (!config) return;
  
  const x = figma.viewport.center.x - config.width/2;
  const y = figma.viewport.center.y - config.height/2;
  
  if (elementType === 'component-1') {
    await createComponent1(x, y, config);
  } else if (elementType === 'small-graph') {
    await createSmallGraph(x, y, config);
  } else if (elementType === 'ui-component') {
    await createUIComponent(x, y, config);
  } else if (elementType === 'green-cube') {
    await createCube(x, y, config, 'green');
  }
  
  figma.notify(`Created ${elementType}!`);
}

async function createComponent1(x, y, config) {
  try {
    // Import the component from the published file
    const componentSet = await figma.importComponentByKeyAsync(componentConfig.fileKey, componentConfig.nodeId);
    
    if (componentSet) {
      // Create an instance of the component
      const instance = componentSet.createInstance();
      
      // Position the component at the center of the viewport
      instance.x = x;
      instance.y = y;
      
      // Add to the current page
      figma.currentPage.appendChild(instance);
      
      // Select the created instance
      figma.currentPage.selection = [instance];
      
      // Scroll to the created component
      figma.viewport.scrollAndZoomIntoView([instance]);
      
      figma.notify(`Created ${componentConfig.name}!`);
    } else {
      figma.notify('Could not import component. Please check if the component is published.');
    }
  } catch (error) {
    console.error('Error importing component:', error);
    figma.notify('Error importing component. Please check the component key and node ID.');
  }
}

async function createSmallGraph(x, y, config) {
  // Create main auto-layout frame
  const graphFrame = figma.createFrame();
  graphFrame.name = "Small Graph / KPI";
  graphFrame.resize(config.width, config.height);
  graphFrame.x = x;
  graphFrame.y = y;
  graphFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
  graphFrame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  graphFrame.strokeWeight = 1;
  graphFrame.cornerRadius = 12;
  
  // Set up auto-layout
  graphFrame.layoutMode = "VERTICAL";
  graphFrame.primaryAxisSizingMode = "FIXED";
  graphFrame.counterAxisSizingMode = "FIXED";
  graphFrame.paddingLeft = 16;
  graphFrame.paddingRight = 16;
  graphFrame.paddingTop = 16;
  graphFrame.paddingBottom = 16;
  graphFrame.itemSpacing = 8;
  
  // Create title text
  const titleText = figma.createText();
  titleText.name = "Title";
  titleText.characters = config.text;
  titleText.fontSize = 14;
  titleText.fontWeight = 500;
  titleText.fontName = { family: "Inter", style: "Medium" };
  titleText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  titleText.autoRename = false;
  
  // Create value text
  const valueText = figma.createText();
  valueText.name = "Value";
  valueText.characters = config.value;
  valueText.fontSize = 24;
  valueText.fontWeight = 700;
  valueText.fontName = { family: "Inter", style: "Bold" };
  valueText.fills = [{ type: 'SOLID', color: config.color }];
  valueText.autoRename = false;
  
  // Create simple bar chart
  const barChart = figma.createFrame();
  barChart.name = "Bar Chart";
  barChart.resize(120, 20);
  barChart.fills = [];
  
  // Create bars
  const bar1 = figma.createRectangle();
  bar1.name = "Bar 1";
  bar1.resize(20, 20);
  bar1.fills = [{ type: 'SOLID', color: config.color }];
  bar1.cornerRadius = 4;
  
  const bar2 = figma.createRectangle();
  bar2.name = "Bar 2";
  bar2.resize(25, 16);
  bar2.x = 25;
  bar2.y = 2;
  bar2.fills = [{ type: 'SOLID', color: { r: config.color.r * 0.8, g: config.color.g * 0.8, b: config.color.b * 0.8 } }];
  bar2.cornerRadius = 4;
  
  const bar3 = figma.createRectangle();
  bar3.name = "Bar 3";
  bar3.resize(30, 12);
  bar3.x = 55;
  bar3.y = 4;
  bar3.fills = [{ type: 'SOLID', color: { r: config.color.r * 0.6, g: config.color.g * 0.6, b: config.color.b * 0.6 } }];
  bar3.cornerRadius = 4;
  
  const bar4 = figma.createRectangle();
  bar4.name = "Bar 4";
  bar4.resize(35, 18);
  bar4.x = 90;
  bar4.y = 1;
  bar4.fills = [{ type: 'SOLID', color: { r: config.color.r * 0.9, g: config.color.g * 0.9, b: config.color.b * 0.9 } }];
  bar4.cornerRadius = 4;
  
  barChart.appendChild(bar1);
  barChart.appendChild(bar2);
  barChart.appendChild(bar3);
  barChart.appendChild(bar4);
  
  // Add elements to frame
  graphFrame.appendChild(titleText);
  graphFrame.appendChild(valueText);
  graphFrame.appendChild(barChart);
  
  figma.currentPage.selection = [graphFrame];
  figma.viewport.scrollAndZoomIntoView([graphFrame]);
}

async function createUIComponent(x, y, config) {
  if (figma.currentPage.selection.length > 0) {
    const selectedNode = figma.currentPage.selection[0];
    const clone = selectedNode.clone();
    clone.x = x;
    clone.y = y;
    figma.currentPage.selection = [clone];
    figma.viewport.scrollAndZoomIntoView([clone]);
    figma.notify(`Cloned: ${selectedNode.name}`);
  } else {
    figma.notify('Please select your component in Figma before using the UI Component grid item.');
  }
}

function createPlaceholderUIComponent(x, y) {
  // Create a placeholder UI component frame
  const uiFrame = figma.createFrame();
  uiFrame.name = "UI Component Placeholder";
  uiFrame.resize(120, 80);
  uiFrame.x = x;
  uiFrame.y = y;
  uiFrame.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.6, b: 0.9 } }];
  uiFrame.cornerRadius = 8;
  uiFrame.strokes = [{ type: 'SOLID', color: { r: 0.3, g: 0.5, b: 0.8 } }];
  uiFrame.strokeWeight = 2;
  
  // Add some visual elements to make it look like a UI component
  const icon = figma.createText();
  icon.name = "Icon";
  icon.characters = "🎨";
  icon.fontSize = 24;
  icon.x = x + 48;
  icon.y = y + 20;
  icon.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  const label = figma.createText();
  label.name = "Label";
  label.characters = "UI Component";
  label.fontSize = 12;
  label.fontWeight = 500;
  label.fontName = { family: "Inter", style: "Medium" };
  label.x = x + 20;
  label.y = y + 50;
  label.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  figma.currentPage.selection = [uiFrame];
  figma.viewport.scrollAndZoomIntoView([uiFrame]);
}

async function createCube(x, y, config, colorName) {
  const size = config.width;
  
  // Create the main cube face (front)
  const frontFace = figma.createRectangle();
  frontFace.name = `${colorName} Cube - Front`;
  frontFace.resize(size, size);
  frontFace.x = x;
  frontFace.y = y;
  frontFace.fills = [{ type: 'SOLID', color: config.color }];
  frontFace.cornerRadius = 8;
  
  // Create the top face
  const topFace = figma.createRectangle();
  topFace.name = `${colorName} Cube - Top`;
  topFace.resize(size, size * 0.3);
  topFace.x = x + size * 0.15;
  topFace.y = y - size * 0.3;
  topFace.fills = [{ type: 'SOLID', color: { r: config.color.r * 0.8, g: config.color.g * 0.8, b: config.color.b * 0.8 } }];
  topFace.cornerRadius = 8;
  
  // Create the right face
  const rightFace = figma.createRectangle();
  rightFace.name = `${colorName} Cube - Right`;
  rightFace.resize(size * 0.3, size);
  rightFace.x = x + size;
  rightFace.y = y + size * 0.15;
  rightFace.fills = [{ type: 'SOLID', color: { r: config.color.r * 0.6, g: config.color.g * 0.6, b: config.color.b * 0.6 } }];
  rightFace.cornerRadius = 8;
  
  // Create a group to contain all cube faces
  const cubeGroup = figma.group([frontFace, topFace, rightFace], figma.currentPage);
  cubeGroup.name = `${colorName} Cube`;
  
  // Add a subtle shadow effect
  cubeGroup.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.2 },
      offset: { x: 2, y: 4 },
      radius: 8,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];
  
  // Select the created cube
  figma.currentPage.selection = [cubeGroup];
  figma.viewport.scrollAndZoomIntoView([cubeGroup]);
}