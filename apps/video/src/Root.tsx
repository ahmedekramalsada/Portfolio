import { Composition } from 'remotion';
import { TitleCard } from './TitleCard';
import { ProjectShowcase } from './ProjectShowcase';
import { TOTAL, ZeroDowntimeDeploys } from './ZeroDowntimeDeploys';
import { CoreStill } from './CoreStill';
import { NexReferenceComparison, NexReferenceDemo } from './nex/NexReferencePreview';
import { NexProceduralComparison, NexProceduralDemo } from './nex/NexProceduralPreview';
import { AiRobotOriginal } from './ai-robot/AiRobotOriginal';
import { AiRobotEducation } from './ai-robot/AiRobotEducation';
import { AiRobotShowcase } from './ai-robot/AiRobotShowcase';
import { InstructorVideo, InstructorDemo, SAMPLE_SCRIPT, SAMPLE_SCRIPT_DURATION } from './ai-robot/instructor/InstructorVideo';
import { SampleStyleDemo, SAMPLE_STYLE_DURATION } from './ai-robot/instructor/SampleStyleDemo';
import { MacTerminalTest, MAC_TERMINAL_TEST_DURATION } from './ai-robot/instructor/MacTerminalTest';
import { RobotTerminalDemo, ROBOT_TERMINAL_DURATION } from './ai-robot/instructor/RobotTerminalDemo';
import { LlmVsAgent, LLM_VS_AGENT_DURATION } from './ai-robot/instructor/LlmVsAgent';
import { VoiceoverTest, VOICEOVER_TEST_DURATION } from './ai-robot/instructor/VoiceoverTest';
import { OneMinuteTest, ONE_MINUTE_DURATION } from './ai-robot/instructor/OneMinuteTest';
import { McpVideo, MCP_DURATION } from './ai-robot/instructor/McpVideo';

const FPS = 30;
const LANDSCAPE = { width: 1920, height: 1080 };
const VERTICAL = { width: 1080, height: 1920 };

export function RemotionRoot() {
  return (
    <>
      <Composition id="NexProceduralComparison" component={NexProceduralComparison} durationInFrames={1} fps={60} {...LANDSCAPE} />
      <Composition id="NexProceduralDemo" component={NexProceduralDemo} durationInFrames={480} fps={60} {...VERTICAL} />
      <Composition
        id="NexReferenceComparison"
        component={NexReferenceComparison}
        durationInFrames={1}
        fps={60}
        {...LANDSCAPE}
      />
      <Composition
        id="NexReferenceDemo"
        component={NexReferenceDemo}
        durationInFrames={720}
        fps={60}
        {...VERTICAL}
      />
      <Composition
        id="TitleCard"
        component={TitleCard}
        durationInFrames={3 * FPS}
        fps={FPS}
        {...LANDSCAPE}
        defaultProps={{
          hook: 'I break production so you don’t have to.',
          sub: 'DevOps lessons, told straight.',
          tag: 'AHMED OS',
        }}
      />
      <Composition
        id="TitleCardVertical"
        component={TitleCard}
        durationInFrames={3 * FPS}
        fps={FPS}
        {...VERTICAL}
        defaultProps={{
          hook: 'I break production so you don’t have to.',
          sub: 'DevOps lessons, told straight.',
          tag: 'AHMED OS',
        }}
      />
      <Composition
        id="ProjectShowcase"
        component={ProjectShowcase}
        durationInFrames={6 * FPS}
        fps={FPS}
        {...LANDSCAPE}
        defaultProps={{
          title: 'Zero-downtime deploys',
          outcome: 'From Friday fear to boring releases.',
          points: ['Blue-green on Cloudflare', 'Health-gated rollouts', 'One-command rollback'],
          stack: ['Cloudflare', 'Docker', 'GitHub Actions'],
        }}
      />
      <Composition
        id="ZeroDowntimeDeploys"
        component={ZeroDowntimeDeploys}
        durationInFrames={TOTAL}
        fps={60}
        {...LANDSCAPE}
      />
      <Composition
        id="CoreStill"
        component={CoreStill}
        durationInFrames={60}
        fps={60}
        {...VERTICAL}
      />
      <Composition
        id="AiRobotOriginal"
        component={AiRobotOriginal}
        durationInFrames={180}
        fps={FPS}
        width={682}
        height={902}
      />
      <Composition
        id="AiRobotEducation"
        component={AiRobotEducation}
        durationInFrames={300}
        fps={FPS}
        width={682}
        height={902}
      />
      <Composition
        id="AiRobotShowcase"
        component={AiRobotShowcase}
        durationInFrames={1800}
        fps={FPS}
        width={720}
        height={1280}
      />
      <Composition
        id="InstructorDemo"
        component={InstructorDemo}
        durationInFrames={SAMPLE_SCRIPT_DURATION}
        fps={FPS}
        width={720}
        height={1280}
      />
      <Composition
        id="SampleStyleDemo"
        component={SampleStyleDemo}
        durationInFrames={SAMPLE_STYLE_DURATION}
        fps={FPS}
        width={720}
        height={1280}
      />
      <Composition
        id="MacTerminalTest"
        component={MacTerminalTest}
        durationInFrames={MAC_TERMINAL_TEST_DURATION}
        fps={FPS}
        width={720}
        height={1280}
      />
      <Composition
        id="RobotTerminalDemo"
        component={RobotTerminalDemo}
        durationInFrames={ROBOT_TERMINAL_DURATION}
        fps={FPS}
        width={720}
        height={1280}
      />
      <Composition
        id="LlmVsAgent"
        component={LlmVsAgent}
        durationInFrames={LLM_VS_AGENT_DURATION}
        fps={FPS}
        width={720}
        height={1280}
      />
      <Composition
        id="VoiceoverTest"
        component={VoiceoverTest}
        durationInFrames={VOICEOVER_TEST_DURATION}
        fps={FPS}
        width={720}
        height={1280}
      />
      <Composition
        id="OneMinuteTest"
        component={OneMinuteTest}
        durationInFrames={ONE_MINUTE_DURATION}
        fps={FPS}
        width={720}
        height={1280}
      />
      <Composition
        id="McpVideo"
        component={McpVideo}
        durationInFrames={MCP_DURATION}
        fps={FPS}
        width={720}
        height={1280}
      />
    </>
  );
}
