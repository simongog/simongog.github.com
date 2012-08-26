#include <sdsl/suffixtrees.hpp>

using namespace sdsl;

int main(int argc, char **argv){
  cst_sct3<> cst;
  construct_cst(argv[1], cst);
  util::store_to_file(cst, (std::string(argv[1])+".cst3").c_str() );
}
