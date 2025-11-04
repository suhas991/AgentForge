export async function executeChain(workflow, agents, initialInput, onRunAgent) {
  const results = [];
  let currentInput = initialInput;

  for (let i = 0; i < workflow.agents.length; i++) {
    const workflowAgent = workflow.agents[i];
    const agent = agents.find(a => a.id === workflowAgent.agentId);
    
    if (!agent) {
      throw new Error(`Agent not found: ${workflowAgent.agentId}`);
    }

    console.log(`🔄 Running step ${i + 1}/${workflow.agents.length}: ${agent.name}`);
    
    try {
      const output = await onRunAgent(agent, currentInput, {});
      
      results.push({
        step: i + 1,
        agentId: agent.id,
        agentName: agent.name,
        input: currentInput,
        output,
        status: 'success'
      });
      
      currentInput = output; // Pass output to next agent
    } catch (error) {
      results.push({
        step: i + 1,
        agentId: agent.id,
        agentName: agent.name,
        input: currentInput,
        output: null,
        error: error.message,
        status: 'error'
      });
      throw error; // Stop chain on error
    }
  }

  return {
    workflowId: workflow.id,
    workflowName: workflow.name,
    results,
    finalOutput: currentInput
  };
}
