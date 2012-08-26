CC=g++
CC_FLAGS=-Wall -g -O3 -I/Users/simon.gog/test2/include -L/Users/simon.gog/test2/lib -DNDEBUG -funroll-loops -msse4.2
CCLIB=-lsdsl -ldivsufsort -ldivsufsort64 
SOURCES=$(wildcard *.cpp)
EXECS=$(SOURCES:.cpp=)

all: $(EXECS)
	        
%:%.cpp
	$(CC) $(CC_FLAGS) -o $@ $< $(CCLIB) 

clean:
	rm -f $(EXECS)
	rm -rf *.dSYM

