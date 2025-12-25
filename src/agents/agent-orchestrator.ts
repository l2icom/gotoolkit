import { AIAgent, AITask, AIContext, AIReturn } from './agent-core';

export class AgentOrchestrator {
    private agents: Map<string, AIAgent>;
    private defaultAgentId: string | null;
    
    constructor() {
        this.agents = new Map();
        this.defaultAgentId = null;
    }
    
    registerAgent(agent: AIAgent): void {
        this.agents.set(agent.id, agent);
        if (!this.defaultAgentId) {
            this.defaultAgentId = agent.id;
        }
    }
    
    getAgent(agentId: string): AIAgent | undefined {
        return this.agents.get(agentId);
    }
    
    setDefaultAgent(agentId: string): void {
        if (this.agents.has(agentId)) {
            this.defaultAgentId = agentId;
        }
    }
    
    async executeTask(task: AITask, context: AIContext): Promise<AIReturn> {
        // Find the most suitable agent for this task
        const suitableAgents = this.findSuitableAgents(task);
        
        if (suitableAgents.length === 0) {
            return this.handleNoSuitableAgent(task, context);
        }
        
        // For now, use the first suitable agent
        // TODO: Implement more sophisticated agent selection logic
        const selectedAgent = suitableAgents[0];
        
        try {
            const result = await selectedAgent.executeTask(task, context);
            
            // Update agent memory with task execution results
            selectedAgent.updateMemory(`task_${task.id}_result`, result);
            
            return result;
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error instanceof Error ? error : new Error(String(error)),
                metadata: {
                    agentId: selectedAgent.id,
                    taskId: task.id,
                    timestamp: new Date().toISOString()
                }
            };
        }
    }
    
    private findSuitableAgents(task: AITask): AIAgent[] {
        const suitable: AIAgent[] = [];
        
        // Check all agents for capability match
        for (const [agentId, agent] of this.agents) {
            if (agent.canHandleTask(task)) {
                suitable.push(agent);
            }
        }
        
        // If no agents can handle the task, return default agent if available
        if (suitable.length === 0 && this.defaultAgentId) {
            const defaultAgent = this.agents.get(this.defaultAgentId);
            if (defaultAgent) {
                suitable.push(defaultAgent);
            }
        }
        
        return suitable;
    }
    
    private async handleNoSuitableAgent(task: AITask, context: AIContext): Promise<AIReturn> {
        return {
            success: false,
            result: null,
            error: new Error(`No agent available to handle task type: ${task.type}`),
            metadata: {
                taskId: task.id,
                availableAgents: Array.from(this.agents.keys()),
                timestamp: new Date().toISOString()
            }
        };
    }
    
    async executeMultiAgentTask(mainTask: AITask, context: AIContext): Promise<AIReturn> {
        // TODO: Implement multi-agent collaboration
        // This will be enhanced in future iterations
        return this.executeTask(mainTask, context);
    }
    
    getAvailableAgents(): string[] {
        return Array.from(this.agents.keys());
    }
    
    getAgentCapabilities(agentId: string): string[] | undefined {
        const agent = this.agents.get(agentId);
        return agent?.capabilities;
    }
}