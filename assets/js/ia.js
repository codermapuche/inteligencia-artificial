function Neuron(size, threshold, adjustment, weight) {
  this.threshold = (threshold ? threshold : 0);
  this.adjustment = (adjustment ? adjustment : 1);
  this.weight = (weight ? weight : 0);
  this.memory = Array(size ? size : 1).fill(this.weight);
}

Neuron.prototype.active = function (input) {
  const memory 	= this.memory,
        weight 	= this.weight,
		    sigma	  = input.reduce((sum, ik, k) => (sum + (ik * memory[k]) + weight), weight);

  return Boolean(sigma > this.threshold);
}

Neuron.prototype.train = function (samples, limit) {
  const adjustment = this.adjustment;

  limit || (limit = Number.MAX_SAFE_INTEGER);
	
  let index = 0;
  do {
		let sample = samples[index],
			  output = this.active(sample.i);

		if (output !== sample.o) {
			index = -1;
			output = (output ? -1 : 1);
			this.memory = this.memory.map((_, k) => (_ + (output * adjustment * sample.i[k])));
      this.weight = this.weight + (output * adjustment);
			limit--;
		}
    
		index++;
  } while (index !== samples.length && limit > 0);
	
  return Boolean(index === samples.length);
}

function Network(endpoint, inputs) {
  this.endpoint = endpoint;
  this.inputs = inputs.map((input) => {
		if ( (input instanceof Neuron) || (input instanceof Network) ) {
			return input;
		}
		
		return new Network.Input(input);
	});
}

Network.prototype.active = function(input) {
  return this.endpoint.active(this.inputs.map((i) => (Number(i.active(input)))));	
}

Network.Input = function Input(index) {	
	this.index = index;
}

Network.Input.prototype.active = function (input) {
  return input[this.index];
}