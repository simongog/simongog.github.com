#include <sdsl/suffixtrees.hpp>
#include <cstdlib>

using namespace sdsl;
using namespace std;

int main(int argc, char **argv){
  cst_sct3<> cst;
  util::load_from_file(cst, (std::string(argv[1])+".cst3").c_str() );
  typedef cst_sct3<>::size_type size_type;
  size_type k = atoi(argv[2]);
  size_type contexts = 0;

  cout << "# test_case = " << util::basename(std::string(argv[1])) << endl;
  cout << "# k = " << k << endl;
  cout << "# H_k = " << Hk(cst, k, contexts) << endl;
  cout << "# contexts = " << contexts << endl;
}
