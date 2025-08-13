import React, { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as SunCalc from "suncalc";

function SunLight({ date }: { date: Date }) {
  const latitude = 37.5665;
  const longitude = 126.978;

  const sunPosition = useMemo(() => {
    //고도, 방위각
    const { altitude, azimuth } = SunCalc.getPosition(
      date,
      latitude,
      longitude
    );
    const x = Math.cos(altitude) * Math.sin(azimuth);
    const y = Math.sin(altitude);
    const z = Math.cos(altitude) * Math.cos(azimuth);
    return [x * 10, y * 10, z * 10];
  }, [date]);

  const lightColor = useMemo(() => {
    const hour = date.getHours();
    if (hour >= 6 && hour < 10) return "#ffdca8";
    if (hour >= 10 && hour < 16) return "#ffffff";
    if (hour >= 16 && hour < 19) return "#ffbb66";
    return "#334466";
  }, [date]);

  return (
    <directionalLight
      castShadow
      position={sunPosition as [number, number, number]}
      intensity={1.2}
      color={lightColor}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  );
}

function ClockController({
  date,
  onChange,
}: {
  date: Date;
  onChange: (date: Date) => void;
}) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const roundedMinutes = Math.round(minutes / 10) * 10;

  const totalMinutes = hours * 60 + roundedMinutes;

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotalMinutes = parseInt(e.target.value);
    const newHours = Math.floor(newTotalMinutes / 60);
    const newMinutes = newTotalMinutes % 60;

    const newDate = new Date(date);
    newDate.setHours(newHours, newMinutes);
    onChange(newDate);
  };

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimeOfDay = (hours: number) => {
    if (hours < 6) return "새벽";
    if (hours < 12) return "오전";
    if (hours < 18) return "오후";
    return "밤";
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        zIndex: 1000,
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        minWidth: "250px",
      }}
    >
      <div style={{ marginBottom: "15px", textAlign: "center" }}>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "5px",
          }}
        >
          {formatTime(hours, roundedMinutes)}
        </div>
        <div style={{ fontSize: "12px", color: "#666" }}>
          {getTimeOfDay(hours)}
        </div>
      </div>

      <div>
        <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>시간:</span>
          <input
            type="range"
            min="0"
            max="1439"
            step="10"
            value={totalMinutes}
            onChange={handleTimeChange}
            style={{
              flex: 1,
              cursor: "pointer",
              height: "6px",
              borderRadius: "3px",
              background: "#e0e0e0",
              outline: "none",
            }}
          />
          <span style={{ minWidth: "50px", textAlign: "right" }}>
            {formatTime(hours, roundedMinutes)}
          </span>
        </label>
      </div>
    </div>
  );
}

function Furniture() {
  const bedModel = useGLTF("/models/bedDouble.glb");
  const rugModel = useGLTF("/models/rugRound.glb");
  const lampModel = useGLTF("/models/lampRoundFloor.glb");
  const cabinetModel = useGLTF("/models/cabinetBedDrawer.glb");
  const plantModel = useGLTF("/models/pottedPlant.glb");
  const radioModel = useGLTF("/models/radio.glb");

  return (
    <group>
      <group position={[-1.5, -1, 0]} scale={[2.4, 2.4, 2.4]}>
        {bedModel.scene && <primitive object={bedModel.scene} />}
      </group>
      <group position={[-2, -0.95, 2]} scale={[3.6, 3.6, 3.6]}>
        {rugModel.scene && <primitive object={rugModel.scene} />}
        <group position={[1, 0, -1.1]} scale={[1, 1, 1]}>
          {cabinetModel.scene && <primitive object={cabinetModel.scene} />}
        </group>
        <group position={[0, 0, -1.2]} scale={[0.7, 0.7, 0.7]}>
          {lampModel.scene && <primitive object={lampModel.scene} />}
        </group>
        <group position={[1.3, 0, 0.2]} scale={[0.7, 0.7, 0.7]}>
          {plantModel.scene && <primitive object={plantModel.scene} />}
        </group>
        <group position={[0, 0, -1.2]} scale={[0.7, 0.7, 0.7]}>
          {lampModel.scene && <primitive object={lampModel.scene} />}
        </group>
        <group position={[1, 0.25, -1.2]} scale={[0.7, 0.7, 0.7]}>
          {radioModel.scene && <primitive object={radioModel.scene} />}
        </group>
      </group>
    </group>
  );
}

function Room() {
  const wallWindowModel = useGLTF("/models/wallWindow.glb");
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>
      <mesh position={[0, 0.5, -3]} receiveShadow castShadow>
        <boxGeometry args={[6, 3, 0.1]} />
        <meshStandardMaterial color="#E6E6FA" />
      </mesh>
      <mesh position={[-3, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 3, 6]} />
        <meshStandardMaterial color="#F0F8FF" />
      </mesh>
      <group position={[3, -1, 3]} scale={[6, 2.3, 2]} rotation={[0, 1.57, 0]}>
        {wallWindowModel.scene && <primitive object={wallWindowModel.scene} />}
      </group>
      <Suspense fallback={null}>
        <Furniture />
      </Suspense>
    </group>
  );
}

export default function IsometricRoom() {
  const [time, setTime] = useState(new Date());

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <ClockController date={time} onChange={setTime} />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <SunLight date={time} />
        <Suspense fallback={null}>
          <Room />
        </Suspense>
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.5}
          enableDamping={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
        />
      </Canvas>
    </div>
  );
}
