/*
 * PLACEHOLDER ONLY. Real content + answer key supplied by Dawson/Lisa after clearance. Structure mirrors NMCA Problems in Acting (39). No verbatim copyrighted text in repo until cleared.
 */

export interface ActorStruggle {
  id: string;
  problemTitle: string;
  relatedToolName: string;
  sourceRef: string;
}

export const PENDING_LISA_CLEARANCE_COPY = 'TBD: pending Lisa clearance';

export const ACTOR_STRUGGLES_SOURCE_ATTRIBUTION =
  'Source: NMCA Michael Chekhov Technique Playbook (Dalton, Kilroy, Bowles). [attribution pending]';

export const ACTOR_STRUGGLES: readonly ActorStruggle[] = [
  { id: 'problem-01', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #1' },
  { id: 'problem-02', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #2' },
  { id: 'problem-03', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #3' },
  { id: 'problem-04', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #4' },
  { id: 'problem-05', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #5' },
  { id: 'problem-06', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #6' },
  { id: 'problem-07', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #7' },
  { id: 'problem-08', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #8' },
  { id: 'problem-09', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #9' },
  { id: 'problem-10', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #10' },
  { id: 'problem-11', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #11' },
  { id: 'problem-12', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #12' },
  { id: 'problem-13', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #13' },
  { id: 'problem-14', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #14' },
  { id: 'problem-15', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #15' },
  { id: 'problem-16', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #16' },
  { id: 'problem-17', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #17' },
  { id: 'problem-18', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #18' },
  { id: 'problem-19', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #19' },
  { id: 'problem-20', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #20' },
  { id: 'problem-21', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #21' },
  { id: 'problem-22', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #22' },
  { id: 'problem-23', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #23' },
  { id: 'problem-24', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #24' },
  { id: 'problem-25', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #25' },
  { id: 'problem-26', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #26' },
  { id: 'problem-27', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #27' },
  { id: 'problem-28', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #28' },
  { id: 'problem-29', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #29' },
  { id: 'problem-30', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #30' },
  { id: 'problem-31', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #31' },
  { id: 'problem-32', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #32' },
  { id: 'problem-33', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #33' },
  { id: 'problem-34', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #34' },
  { id: 'problem-35', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #35' },
  { id: 'problem-36', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #36' },
  { id: 'problem-37', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #37' },
  { id: 'problem-38', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #38' },
  { id: 'problem-39', problemTitle: 'TBD', relatedToolName: 'TBD', sourceRef: 'NMCA Problems in Acting #39' },
];

export function getActorStruggleById(id: string): ActorStruggle | undefined {
  return ACTOR_STRUGGLES.find((struggle) => struggle.id === id);
}
