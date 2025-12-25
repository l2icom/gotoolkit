import { BaseAgent, AITask, AIContext, AIReturn } from './agent-core';
import { GoToolkitIA } from '../../public/js/ia-client';

export class ContentGenerationAgent extends BaseAgent {
    constructor() {
        super(
            'content-generator',
            'Content Generation Agent',
            'Generates structured content based on prompts and templates',
            ['content-generation', 'text-generation', 'prompt-processing']
        );
    }
    
    async executeTask(task: AITask, context: AIContext): Promise<AIReturn> {
        try {
            // Extract parameters from the task
            const { prompt, template, contextData } = task.parameters;
            
            // Build the full prompt using context and template
            const fullPrompt = this.buildFullPrompt(prompt, template, contextData, context);
            
            // Use the existing GoToolkit IA system to generate content
            const result = await GoToolkitIA.chatCompletion({
                payload: {
                    messages: [
                        { role: 'system', content: 'You are a helpful content generation assistant.' },
                        { role: 'user', content: fullPrompt }
                    ],
                    stream: false
                }
            });
            
            // Store the result in memory
            this.updateMemory(`generated_content_${task.id}`, result);
            
            return {
                success: true,
                result: this.postProcessResult(result, task),
                metadata: {
                    agentId: this.id,
                    taskId: task.id,
                    timestamp: new Date().toISOString(),
                    promptUsed: fullPrompt
                }
            };
            
        } catch (error) {
            return {
                success: false,
                result: null,
                error: error instanceof Error ? error : new Error(String(error)),
                metadata: {
                    agentId: this.id,
                    taskId: task.id,
                    timestamp: new Date().toISOString()
                }
            };
        }
    }
    
    private buildFullPrompt(prompt: string, template: string, contextData: any, aiContext: AIContext): string {
        // Combine template, prompt, context data, and AI context
        let fullPrompt = template || '';
        
        // Replace placeholders in template
        if (template) {
            fullPrompt = template
                .replace('{{prompt}}', prompt || '')
                .replace('{{context}}', JSON.stringify(contextData || {}))
                .replace('{{user_id}}', aiContext.userId || 'unknown')
                .replace('{{conversation_id}}', aiContext.conversationId || 'new');
        } else {
            fullPrompt = prompt || '';
        }
        
        // Add context data if available
        if (contextData) {
            fullPrompt += '\n\nContext Data:\n' + JSON.stringify(contextData, null, 2);
        }
        
        return fullPrompt;
    }
    
    private postProcessResult(rawResult: string, task: AITask): any {
        // Basic post-processing based on task parameters
        const { outputFormat } = task.parameters;
        
        if (outputFormat === 'json') {
            try {
                return JSON.parse(rawResult);
            } catch (e) {
                return { content: rawResult };
            }
        } else if (outputFormat === 'list') {
            // Convert to array if it's a list
            const lines = rawResult.split('\n').filter(line => line.trim());
            return lines.map(line => line.replace(/^•\s*/, '').trim());
        } else if (outputFormat === 'markdown') {
            return rawResult; // Return as-is for markdown
        }
        
        // Default: return as structured content
        return {
            content: rawResult,
            format: 'text',
            timestamp: new Date().toISOString()
        };
    }
    
    // Additional helper methods for content generation
    
    async generateFromTemplate(templateId: string, data: any, context: AIContext): Promise<AIReturn> {
        // Get template from GoPrompts (existing system)
        const templates = window.GoPrompts?.canvasTemplates || [];
        const template = templates.find(t => t.id === templateId);
        
        if (!template) {
            return {
                success: false,
                result: null,
                error: new Error(`Template ${templateId} not found`),
                metadata: { agentId: this.id }
            };
        }
        
        // Create task for template-based generation
        const task: AITask = {
            id: `template_${Date.now()}`,
            type: 'content-generation',
            description: `Generate content using template ${templateId}`,
            parameters: {
                template: template.description,
                contextData: data,
                outputFormat: 'structured'
            },
            priority: 1
        };
        
        return this.executeTask(task, context);
    }
}