import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTimecode,
  formatTimecodeDetailed,
  parseTimecode,
  filterTranscript,
  calculateActiveJobsStats,
  generateSrt,
  generateVtt,
} from './videoAnalytics';
import { PipelineJob, TranscriptLine } from '../types';

test('formatTimecode formats minutes and seconds properly', () => {
  assert.equal(formatTimecode(0), '00:00');
  assert.equal(formatTimecode(252), '04:12');
  assert.equal(formatTimecode(3665), '01:01:05');
});

test('formatTimecodeDetailed always includes hours, minutes and seconds', () => {
  assert.equal(formatTimecodeDetailed(0), '00:00:00');
  assert.equal(formatTimecodeDetailed(252), '00:04:12');
  assert.equal(formatTimecodeDetailed(3665), '01:01:05');
});

test('parseTimecode correctly parses string timecodes', () => {
  assert.equal(parseTimecode('04:12'), 252);
  assert.equal(parseTimecode('01:01:05'), 3665);
  assert.equal(parseTimecode('45'), 45);
  assert.equal(parseTimecode(''), 0);
});

test('filterTranscript filters by speaker and search query', () => {
  const sampleLines: TranscriptLine[] = [
    {
      id: '1',
      timestamp: '00:00:14',
      seconds: 14,
      speaker: 'Dr. Elena Vance',
      speakerColor: 'secondary',
      text: 'Multimodal video indexing speeds dropping latency to 140ms.',
    },
    {
      id: '2',
      timestamp: '00:01:05',
      seconds: 65,
      speaker: 'Marcus Chen',
      speakerColor: 'tertiary',
      text: 'Whisper large-v3 accuracy at 99.4 percent.',
    },
  ];

  // Search by query
  const res1 = filterTranscript(sampleLines, 'latency', 'all');
  assert.equal(res1.length, 1);
  assert.equal(res1[0].speaker, 'Dr. Elena Vance');

  // Search by speaker
  const res2 = filterTranscript(sampleLines, '', 'Marcus');
  assert.equal(res2.length, 1);
  assert.equal(res2[0].speaker, 'Marcus Chen');

  // No match
  const res3 = filterTranscript(sampleLines, 'nonexistent', 'all');
  assert.equal(res3.length, 0);
});

test('calculateActiveJobsStats computes aggregate pipeline metrics', () => {
  const mockJobs: PipelineJob[] = [
    {
      id: 'job-1',
      filename: 'video1.mp4',
      duration: '45:12',
      durationSeconds: 2712,
      codec: 'H.264',
      status: 'running',
      stageName: 'Multimodal Fusion',
      progress: 88,
      steps: [],
      startedAt: '14:00',
      fileSize: '1.2 GB',
      sttAccuracy: 99.4,
    },
    {
      id: 'job-2',
      filename: 'video2.mov',
      duration: '18:30',
      durationSeconds: 1110,
      codec: 'ProRes',
      status: 'queued',
      stageName: 'Queued',
      progress: 0,
      steps: [],
      startedAt: '14:05',
      fileSize: '4.8 GB',
      sttAccuracy: 98.8,
    },
  ];

  const stats = calculateActiveJobsStats(mockJobs);
  assert.equal(stats.running, 1);
  assert.equal(stats.queued, 1);
  assert.equal(stats.total, 2);
  assert.equal(stats.avgAccuracy, 99.1);
});

test('generateSrt produces valid subtitle blocks', () => {
  const lines: TranscriptLine[] = [
    {
      id: '1',
      timestamp: '00:00:14',
      seconds: 14,
      speaker: 'Elena',
      speakerColor: 'secondary',
      text: 'Hello world',
    },
  ];
  const srt = generateSrt(lines);
  assert.match(srt, /00:00:14,000 --> 00:00:26,000/);
  assert.match(srt, /Elena: Hello world/);
});

test('generateVtt produces valid WebVTT format', () => {
  const lines: TranscriptLine[] = [
    {
      id: '1',
      timestamp: '00:00:14',
      seconds: 14,
      speaker: 'Elena',
      speakerColor: 'secondary',
      text: 'Hello world',
    },
  ];
  const vtt = generateVtt(lines);
  assert.ok(vtt.startsWith('WEBVTT'));
  assert.match(vtt, /00:00:14.000 --> 00:00:26.000/);
});
