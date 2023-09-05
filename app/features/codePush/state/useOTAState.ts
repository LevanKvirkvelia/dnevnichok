import {create} from 'zustand';
import {SDate} from '../../auth/helpers/SDate';

interface useOTAState {
  isLoading: boolean;
  progress: number;
  deploymentKey?: string;

  setIsLoading: (isLoading: boolean) => void;
  setProgress: (progress: number) => void;
  setDeploymentKey: (deploymentKey?: string) => void;
}

export const useOTAState = create<useOTAState>()(set => ({
  isLoading: false,
  progress: 0,
  setIsLoading: isLoading => set({isLoading, progress: 0}),
  setProgress: progress => set({progress}),
  setDeploymentKey: deploymentKey => set({deploymentKey}),
}));
