# Darkness Adaptation

A simple evolution simulation of insect-analog agents in response to varying light conditions.

<ins>**Pigmentation**</ins>  
Agents can range from completely melanized (black) to albino (light yellow). High pigmentation has a baseline metabolic cost with an increased cost in darkness, while low pigmentation is costly in light conditions.

<ins>**Eyes**</ins>  
Eyes always have a baseline cost. Vision range directly correlates with eye size and lighting, and is longer range and more efficient than smell. Visual sensing offers increased agent movement speed if food is within the agents vision range.

<ins>**Antennae**</ins>  
Antennae have a small baseline cost. Larger antennae increase smell range, and the smell range is independant of light, unlike eyes. Movement using only smell-based sensing is slower than sight-based sensing in full light.


Agents are diploid, and their genomes recombine upon reproduction with other agents. Random mutation introduces alleles that alter these traits. Upregulations are dominant, while downregulations are recessive in their inheritance.
