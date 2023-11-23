import { useEffect, useState } from "react";

const FeatureList = () => {
  const [content, setContent] = useState("");
  const string = [
    "Voice-Activated Email Composing",
    "Accessible User Interface",
    "Customizable Preferences",
    "Seamless Integration",
    "Accessibility for Visually Impaired",
    "Tailored for individuals with visual impairments",
    "Make email communication inclusive",
    "Voice Recognition Technology",
    "Harnesses the power of advanced voice recognition",
    "Hands-free interaction with the email platform",
    "User-Friendly Interface",
    "Designed for a seamless and intuitive user experience",
    "Prioritizes simplicity in email composition and management",
    "Effortless Email Management",
    "Send emails effortlessly through voice commands",
    "Easy-to-use tools for managing emails",
    "Hands-Free Operation",
    "Eliminates the traditional keyboard and mouse input",
    "Navigate and control the platform solely through voice",
    "Customized Email Experience",
    "Adapts to the specific needs of visually impaired users",
    "Command-Based Functionality",
    "Utilizes a command-driven system for intuitive control",
    "Execute various email functions using natural voice commands",
    "Innovative Email Platform",
    "Stands out as an innovative solution for accessible email communication",
    "Integrates cutting-edge technology to address accessibility challenges",
  ];
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);

  useEffect(() => {
    if (j === string[i].length) {
      setTimeout(() => {
        if (i === string.length - 1) {
          setI(0);
        } else {
          setI(i + 1);
        }

        setJ(0);
        setContent("");
      }, 1000);
    } else {
      setTimeout(() => {
        setContent(content + string[i][j]);
        setJ(j + 1);
      }, 50);
    }
  });

  return <div className="text-[60px] font-roboto">{content}</div>;
};

export default FeatureList;
